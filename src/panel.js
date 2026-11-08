import JSZip from 'jszip';
import { AGENTS, DIVISIONS, agentById, agentsOf, divisionById, allLeaders } from '../shared/roster.js';
import { renderMarkdown } from './md.js';
import { getHistory, setHistory, clearHistory, clearAllHistory, streamChat, getCrossDivisionContext } from './chat.js';

const $ = (id) => document.getElementById(id);
const initials = (name) => name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readImageAsDataUrl(file, maxWidth = 800) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxWidth || h > maxWidth) {
          if (w > h) {
            h = Math.round((h * maxWidth) / w);
            w = maxWidth;
          } else {
            w = Math.round((w * maxWidth) / h);
            h = maxWidth;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function readFileContent(file) {
  return new Promise((resolve) => {
    const isText = file.type.startsWith('text/') ||
      /\.(txt|md|csv|json|js|jsx|ts|tsx|php|py|html|css|sql|sh|env|yaml|yml|xml|log)$/i.test(file.name);
    if (isText) {
      const reader = new FileReader();
      reader.onload = () => resolve({ isText: true, content: reader.result });
      reader.onerror = () => resolve({ isText: false, content: null });
      reader.readAsText(file);
    } else {
      resolve({ isText: false, content: null });
    }
  });
}

export function createPanel({ onSelect, onClose, onStatus, onNeedCode, isDemo }) {
  const els = {
    panel: $('panel'),
    avatar: $('avatar'),
    name: $('who-name'),
    role: $('who-role'),
    expand: $('btn-expand'),
    iconExpand: $('icon-expand'),
    mates: $('mates'),
    messages: $('messages'),
    quick: $('quick'),
    form: $('composer'),
    input: $('input'),
    send: $('btn-send'),
    reset: $('btn-reset'),
    resetAll: $('btn-reset-all'),
    sidebarResetAll: $('sidebar-btn-reset-all'),
    close: $('btn-close'),
    sidebar: $('panel-sidebar'),
    agentSearch: $('agent-search'),
    clearSearch: $('btn-clear-search'),
    agentList: $('agent-list'),
    attachBtn: $('btn-attach'),
    fileInput: $('file-input'),
    attachmentPreview: $('attachment-preview'),
    topbarMeeting: $('btn-topbar-meeting'),
    openMeeting: $('btn-open-meeting'),
    meetingCount: $('meeting-participant-count'),
    meetingBar: $('meeting-bar'),
    meetingList: $('meeting-participants-list'),
    selectAddMember: $('select-add-member'),
    clearMeetingMembers: $('btn-clear-meeting-participants'),
    meetingMembersTitle: $('meeting-members-title'),
    headToggleMeeting: $('btn-toggle-meeting-bar'),
    meetingToggleBody: $('btn-toggle-meeting-body'),
    meetingToggleText: $('meeting-toggle-text'),
    meetingToggleIcon: $('meeting-toggle-icon'),
    meetingBarSummary: $('meeting-bar-summary'),
    meetingBarContent: $('meeting-bar-content'),
    slashPopup: $('slash-popup'),
    slashList: $('slash-popup-list'),
  };

  let currentId = null;
  let isExpanded = false;
  let pendingAttachments = [];
  const live = new Map(); // agentId -> { text, el, abort }

  const MEETING_STORAGE_KEY = 'kantorai.meeting.participants.v1';
  const MEETING_COLLAPSE_KEY = 'kantorai.meeting.collapsed.v1';
  let isMeetingCollapsed = localStorage.getItem(MEETING_COLLAPSE_KEY) === 'true';

  function setMeetingCollapsed(collapsed) {
    isMeetingCollapsed = collapsed;
    try {
      localStorage.setItem(MEETING_COLLAPSE_KEY, String(collapsed));
    } catch {}
    if (els.meetingBar) {
      els.meetingBar.classList.toggle('collapsed', isMeetingCollapsed);
    }
    const count = meetingParticipants.length;
    if (els.meetingToggleText) {
      els.meetingToggleText.textContent = isMeetingCollapsed
        ? `Atur Peserta (${count})`
        : 'Sembunyikan';
    }
    if (els.meetingToggleIcon) {
      els.meetingToggleIcon.innerHTML = isMeetingCollapsed
        ? '<polyline points="6 9 12 15 18 9"></polyline>'
        : '<polyline points="18 15 12 9 6 15"></polyline>';
    }
    if (els.headToggleMeeting) {
      els.headToggleMeeting.title = isMeetingCollapsed
        ? 'Tampilkan Pengaturan Peserta Rapat'
        : 'Sembunyikan Pengaturan Peserta Rapat';
    }
  }

  function getMeetingParticipants() {
    try {
      const raw = localStorage.getItem(MEETING_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((id) => AGENTS.some((a) => a.id === id));
          if (valid.length > 0) return valid;
        }
      }
    } catch {}
    return allLeaders().map((a) => a.id);
  }

  function saveMeetingParticipants(list) {
    try {
      localStorage.setItem(MEETING_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }

  let meetingParticipants = getMeetingParticipants();
  let responseTargets = [...meetingParticipants];
  const MEETING_RULE_KEY = 'kantorai.meeting.rule.v1';

  try {
    const saved = localStorage.getItem(MEETING_RULE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.type === 'all') {
        responseTargets = [...meetingParticipants];
      } else if (parsed && parsed.id) {
        const targetAgent = AGENTS.find((a) => a.id === parsed.id);
        if (targetAgent && meetingParticipants.includes(targetAgent.id)) {
          responseTargets = [targetAgent.id];
        }
      }
    }
  } catch {}

  function updateRuleDisplay() {
    if (!els.meetingBarSummary) return;
    if (!responseTargets || responseTargets.length === meetingParticipants.length) {
      els.meetingBarSummary.textContent = `${meetingParticipants.length} Anggota Aktif (Semua)`;
    } else if (responseTargets.length === 1) {
      const agent = agentById(responseTargets[0]);
      const label = agent ? agent.name.split(' ')[0] : responseTargets[0];
      els.meetingBarSummary.textContent = `Aturan Aktif: /${agent ? agent.id : responseTargets[0]} (${label})`;
    } else {
      els.meetingBarSummary.textContent = `${responseTargets.length} Anggota Dipilih`;
    }
  }

  function syncResponseTargets() {
    if (!responseTargets || !responseTargets.every((id) => meetingParticipants.includes(id))) {
      responseTargets = [...meetingParticipants];
      try {
        localStorage.setItem(MEETING_RULE_KEY, JSON.stringify({ type: 'all' }));
      } catch {}
    }
    updateRuleDisplay();
  }

  function findAgentByCommand(cmd) {
    const cleanCmd = (cmd || '').toLowerCase().replace(/^[./@]+/, '').trim();
    if (!cleanCmd || cleanCmd === 'all') return 'all';
    // 1. Direct ID match
    let agent = AGENTS.find((a) => a.id.toLowerCase() === cleanCmd);
    if (agent) return agent;
    // 2. ID without dots/symbols
    const cleanNoDot = cleanCmd.replace(/[._-]+/g, '');
    agent = AGENTS.find((a) => a.id.toLowerCase() === cleanNoDot);
    if (agent) return agent;
    // 3. Name comparison
    const normCmd = cleanCmd.replace(/[._-]+/g, ' ');
    agent = AGENTS.find((a) => {
      const normName = a.name.toLowerCase().replace(/[._-]+/g, ' ');
      return normName.includes(normCmd) || normCmd.includes(a.id.toLowerCase());
    });
    if (agent) return agent;
    // 4. Token comparison (e.g. 'bambang' in 'prof.bambang')
    const tokens = normCmd.split(/\s+/).filter((t) => t.length > 2);
    agent = AGENTS.find((a) => {
      const normName = a.name.toLowerCase();
      return tokens.some((t) => normName.includes(t));
    });
    return agent || null;
  }

  function getAgentSlashCmd(agent) {
    if (!agent) return '';
    if (agent.id === 'bambang') return '/prof.bambang';
    if (agent.id === 'ira') return '/dr.ira';
    return `/${agent.id}`;
  }

  let slashFiltered = [];
  let slashSelectedIndex = 0;
  let isSlashOpen = false;

  function closeSlashPopup() {
    isSlashOpen = false;
    if (els.slashPopup) els.slashPopup.hidden = true;
    slashFiltered = [];
    slashSelectedIndex = 0;
  }


  const SYSTEM_SLASH_COMMANDS = [
    {
      id: 'cmd-save',
      cmd: '/save',
      name: 'Simpan Keputusan (Save Context)',
      role: 'Simpan keputusan obrolan ini ke Sprint Memory & Log Sistem',
      divName: 'Internal Memory',
      color: '#10b981',
      badge: 'Sistem',
      icon: '💾',
      isSystem: true,
      needsArg: true,
    },
    {
      id: 'cmd-share-memory',
      cmd: '/share-memory',
      name: 'Sinkronisasi Shared Memory',
      role: 'Bagikan & muat memori kerja lintas divisi ke percakapan ini',
      divName: 'Internal Memory',
      color: '#0ea5e9',
      badge: 'Sistem',
      icon: '🔄',
      isSystem: true,
    },
    {
      id: 'cmd-notulen',
      cmd: '/notulen',
      name: 'Sintesis Notulen Master',
      role: 'Gabungkan seluruh keputusan divisi ke FINAL_MASTER_DOC.md',
      divName: 'Notulen Pusat',
      color: '#8b5cf6',
      badge: 'Sistem',
      icon: '📝',
      isSystem: true,
    },
    {
      id: 'cmd-topologi',
      cmd: '/topologi',
      name: 'Status Topologi Kode (Graphify)',
      role: 'Lihat status graf, node beban (god nodes) & dependency cycle',
      divName: 'Arsitektur',
      color: '#6366f1',
      badge: 'Sistem',
      icon: '🗺️',
      isSystem: true,
    },
    {
      id: 'cmd-status-memori',
      cmd: '/status-memori',
      name: 'Tabel Struktur 3-Tier Memory',
      role: 'Tampilkan tabel status Master Blueprint, Sprint, dan Archive',
      divName: 'Internal Memory',
      color: '#f59e0b',
      badge: 'Sistem',
      icon: '📊',
      isSystem: true,
    },
    {
      id: 'cmd-clipping',
      cmd: '/clipping',
      name: 'Buka Clipping Blueprint',
      role: 'Muat potongan indeks spesifik (contoh: /clipping TECH-01)',
      divName: 'Master Blueprint',
      color: '#14b8a6',
      badge: 'Sistem',
      icon: '📑',
      isSystem: true,
      needsArg: true,
    },
    {
      id: 'cmd-reset',
      cmd: '/reset',
      name: 'Reset Sesi Percakapan',
      role: 'Kosongkan memori obrolan sesi agen saat ini untuk mulai baru',
      divName: 'Sesi',
      color: '#ef4444',
      badge: 'Sistem',
      icon: '🗑️',
      isSystem: true,
    },
  ];

  function updateSlashPopup(query = '') {
    if (!els.slashPopup || !els.slashList || !currentId) {
      closeSlashPopup();
      return;
    }

    const allItem = {
      id: 'all',
      cmd: '/all',
      name: 'Semua Anggota Rapat',
      role: 'Seluruh divisi aktif bergantian menjawab',
      divName: 'Semua Tim',
      color: '#6366f1',
      badge: 'Semua Menjawab',
      isAll: true,
    };

    const memberItems = meetingParticipants
      .map((pid) => {
        const a = agentById(pid);
        if (!a) return null;
        const div = divisionById(a.division);
        return {
          id: a.id,
          cmd: getAgentSlashCmd(a),
          name: a.name,
          role: a.role,
          divName: div.name,
          color: div.color,
          initials: initials(a.name),
          badge: 'Target Khusus',
          isAll: false,
        };
      })
      .filter(Boolean);

    let candidates = [];
    if (currentId === 'meeting') {
      candidates = [allItem, ...memberItems, ...SYSTEM_SLASH_COMMANDS];
    } else {
      candidates = [...SYSTEM_SLASH_COMMANDS];
    }

    const popupTitle = els.slashPopup.querySelector('.slash-popup-title');
    if (popupTitle) {
      popupTitle.textContent = currentId === 'meeting'
        ? '🎯 Target Respon Ruang Rapat & Perintah Sistem'
        : '⚡ Perintah Sistem Vatio (Antigravity Style)';
    }
    const q = (query || '').toLowerCase().trim();

    if (!q) {
      slashFiltered = candidates;
    } else {
      slashFiltered = candidates.filter((item) => {
        const cmdClean = item.cmd.replace('/', '').toLowerCase();
        return (
          cmdClean.includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.role.toLowerCase().includes(q) ||
          item.divName.toLowerCase().includes(q)
        );
      });
    }

    if (slashFiltered.length === 0) {
      closeSlashPopup();
      return;
    }

    isSlashOpen = true;
    els.slashPopup.hidden = false;
    slashSelectedIndex = Math.min(slashSelectedIndex, slashFiltered.length - 1);
    if (slashSelectedIndex < 0) slashSelectedIndex = 0;
    renderSlashList();
  }

  function updateSlashHighlight() {
    if (!els.slashList) return;
    const items = els.slashList.querySelectorAll('.slash-item');
    items.forEach((item, idx) => {
      item.classList.toggle('selected', idx === slashSelectedIndex);
    });
  }

  function scrollSlashIntoView() {
    if (!els.slashList) return;
    const selectedEl = els.slashList.querySelector(`.slash-item[data-idx="${slashSelectedIndex}"]`);
    selectedEl?.scrollIntoView({ block: 'nearest' });
  }

  function renderSlashList() {
    if (!els.slashList) return;
    els.slashList.innerHTML = '';
    slashFiltered.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = `slash-item ${idx === slashSelectedIndex ? 'selected' : ''}`;
      row.dataset.idx = idx;
      row.style.setProperty('--c', item.color);

      const avatarHtml = item.icon
        ? `<div class="slash-item-avatar" style="font-size: 16px;">${item.icon}</div>`
        : (item.isAll
          ? `<div class="slash-item-avatar all-avatar">👥</div>`
          : `<div class="slash-item-avatar">${item.initials}</div>`);

      row.innerHTML = `
        ${avatarHtml}
        <div class="slash-item-info">
          <div class="slash-item-main">
            <span class="slash-item-cmd">${item.cmd}</span>
            <span class="slash-item-name">${item.name}</span>
            <span class="slash-item-badge">${item.badge}</span>
          </div>
          <div class="slash-item-desc">${item.role} · ${item.divName}</div>
        </div>
      `;

      row.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectSlashItem(item);
      });

      row.addEventListener('mouseenter', () => {
        slashSelectedIndex = idx;
        updateSlashHighlight();
      });

      els.slashList.appendChild(row);
    });
    scrollSlashIntoView();
  }

  function selectSlashItem(item) {
    if (!item) return;
    closeSlashPopup();

    if (item.isSystem) {
      if (!item.needsArg) {
        els.input.value = item.cmd;
        autosize();
        syncSend();
        submit(item.cmd);
        return;
      }
      els.input.value = `${item.cmd} `;
      autosize();
      syncSend();
      els.input.focus();
      return;
    }

    els.input.value = `${item.cmd} `;

    if (item.isAll) {
      responseTargets = [...meetingParticipants];
      try {
        localStorage.setItem(MEETING_RULE_KEY, JSON.stringify({ type: 'all' }));
      } catch {}
      updateRuleDisplay();
    } else {
      if (!meetingParticipants.includes(item.id)) {
        meetingParticipants.push(item.id);
        saveMeetingParticipants(meetingParticipants);
        renderMeetingParticipants();
      }
      responseTargets = [item.id];
      try {
        localStorage.setItem(MEETING_RULE_KEY, JSON.stringify({ id: item.id }));
      } catch {}
      updateRuleDisplay();
    }

    autosize();
    syncSend();
    els.input.focus();
  }

  function renderMeetingParticipants() {
    if (!els.meetingList) return;
    syncResponseTargets();
    const count = meetingParticipants.length;
    if (els.meetingCount) els.meetingCount.textContent = `${count} Anggota Aktif`;
    if (els.meetingMembersTitle) els.meetingMembersTitle.innerHTML = `<strong>Anggota di Ruangan (${count}):</strong>`;
    updateRuleDisplay();
    if (isMeetingCollapsed && els.meetingToggleText) els.meetingToggleText.textContent = `Atur Peserta (${count})`;

    els.meetingList.innerHTML = '';
    if (count === 0) {
      els.meetingList.innerHTML = '<div style="font-size:12.5px; color:#ef4444; padding:4px 0;">Belum ada anggota di ruang rapat. Silakan pilih preset di atas atau tambah anggota lewat dropdown.</div>';
    } else {
      meetingParticipants.forEach((id) => {
        const agent = agentById(id);
        if (!agent) return;
        const div = divisionById(agent.division);
        const chip = document.createElement('div');
        chip.className = 'meeting-chip';
        chip.style.setProperty('--c', div.color);
        chip.innerHTML = `
          <span class="meeting-chip-avatar">${initials(agent.name)}</span>
          <span class="meeting-chip-name">${agent.name.split(' ')[0]} <small>(${div.short || div.name})</small></span>
          <button type="button" class="meeting-chip-kick" data-id="${agent.id}" title="Keluarkan ${agent.name} dari rapat">✕</button>
        `;
        els.meetingList.appendChild(chip);
      });
    }

    if (els.selectAddMember) {
      els.selectAddMember.innerHTML = '<option value="">+ Tambah Anggota ke Ruangan...</option>';
      const available = AGENTS.filter((a) => !meetingParticipants.includes(a.id));
      DIVISIONS.forEach((div) => {
        const inDiv = available.filter((a) => a.division === div.id);
        if (inDiv.length > 0) {
          const grp = document.createElement('optgroup');
          grp.label = div.name;
          inDiv.forEach((a) => {
            const opt = document.createElement('option');
            opt.value = a.id;
            opt.textContent = `${a.name} (${a.role})`;
            grp.appendChild(opt);
          });
          els.selectAddMember.appendChild(grp);
        }
      });
    }
  }

  const scrollDown = (force = false) => {
    const m = els.messages;
    const near = m.scrollHeight - m.scrollTop - m.clientHeight < 160;
    if (force || near) m.scrollTop = m.scrollHeight;
  };

  let searchHighlightIndex = -1;

  function selectAndFocus(agentId) {
    if (els.panel) {
      els.panel.classList.remove('mobile-show-sidebar');
    }
    onSelect(agentId);
    setTimeout(() => {
      if (els.input) {
        els.input.focus();
        const len = els.input.value.length;
        els.input.setSelectionRange(len, len);
      }
    }, 60);
  }

  function highlightAgentItem(idx, focusElement = false) {
    if (!els.agentList) return;
    const items = Array.from(els.agentList.querySelectorAll('.agent-item'));
    if (!items.length) {
      searchHighlightIndex = -1;
      return;
    }
    if (idx < 0) {
      searchHighlightIndex = -1;
      items.forEach((it) => {
        it.classList.remove('highlighted');
        it.removeAttribute('aria-selected');
      });
      return;
    }
    searchHighlightIndex = Math.max(0, Math.min(idx, items.length - 1));
    items.forEach((it, i) => {
      const isSel = i === searchHighlightIndex;
      it.classList.toggle('highlighted', isSel);
      if (isSel) {
        it.setAttribute('aria-selected', 'true');
        it.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        if (focusElement) it.focus({ preventScroll: true });
      } else {
        it.removeAttribute('aria-selected');
      }
    });
  }

  function renderAgentList(filter = '') {
    if (!els.agentList) return;
    const q = filter.trim().toLowerCase();
    const matchMeeting = !q || 'ruang rapat tim multi-agen grup group meeting forum'.includes(q);
    if (els.openMeeting) {
      els.openMeeting.style.display = matchMeeting ? '' : 'none';
    }

    const filtered = AGENTS.filter((a) => {
      if (!q) return true;
      const div = divisionById(a.division);
      const skillsStr = (a.skills || []).join(' ').toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.focus.toLowerCase().includes(q) ||
        div.name.toLowerCase().includes(q) ||
        skillsStr.includes(q)
      );
    });

    if (q) {
      filtered.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        const aStarts = nameA.startsWith(q);
        const bStarts = nameB.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        const aInc = nameA.includes(q);
        const bInc = nameB.includes(q);
        if (aInc && !bInc) return -1;
        if (!aInc && bInc) return 1;

        const roleA = a.role.toLowerCase().includes(q);
        const roleB = b.role.toLowerCase().includes(q);
        if (roleA && !roleB) return -1;
        if (!roleA && roleB) return 1;

        return 0;
      });
    }

    els.agentList.innerHTML = '';
    if (filtered.length === 0) {
      searchHighlightIndex = -1;
      if (!matchMeeting) {
        els.agentList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--ink-soft); font-size: 13px;">Tidak ada anggota yang cocok.</div>';
      }
      return;
    }

    // Jika sedang mencari (q ada isinya), otomatis sorot hasil pertama agar Enter langsung memilihnya
    searchHighlightIndex = q ? 0 : -1;

    filtered.forEach((a, idx) => {
      const div = divisionById(a.division);
      const item = document.createElement('div');
      const isHighlighted = idx === searchHighlightIndex;
      item.className = `agent-item ${a.id === currentId ? 'active' : ''} ${isHighlighted ? 'highlighted' : ''}`;
      item.dataset.id = a.id;
      item.dataset.index = idx;
      item.tabIndex = 0;
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `${a.name}, ${a.role}`);
      if (isHighlighted) item.setAttribute('aria-selected', 'true');

      item.innerHTML = `
        <div class="agent-item-avatar" style="--c: ${div.color}">
          ${initials(a.name)}
        </div>
        <div class="agent-item-info">
          <div class="agent-item-name">${a.name}</div>
          <div class="agent-item-role">${a.role}</div>
          <div class="agent-item-div" style="--c: ${div.color}">${div.name}</div>
        </div>
      `;

      item.addEventListener('mouseenter', () => {
        highlightAgentItem(idx, false);
      });

      item.addEventListener('click', () => {
        selectAndFocus(a.id);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          highlightAgentItem(idx + 1, true);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (idx > 0) {
            highlightAgentItem(idx - 1, true);
          } else {
            highlightAgentItem(-1);
            els.agentSearch?.focus();
          }
        } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          selectAndFocus(a.id);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          highlightAgentItem(-1);
          els.agentSearch?.focus();
        }
      });

      els.agentList.appendChild(item);
    });
  }

  function toggleExpand(forceState) {
    isExpanded = typeof forceState === 'boolean' ? forceState : !isExpanded;
    els.panel.classList.toggle('expanded', isExpanded);
    if (els.iconExpand) {
      if (isExpanded) {
        els.iconExpand.innerHTML = `
          <polyline points="4 14 10 14 10 20"></polyline>
          <polyline points="20 10 14 10 14 4"></polyline>
          <line x1="14" y1="10" x2="21" y2="3"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        `;
        els.expand.title = 'Kecilkan mode chat';
        renderAgentList(els.agentSearch?.value || '');
      } else {
        els.iconExpand.innerHTML = `
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        `;
        els.expand.title = 'Perbesar / Mode WhatsApp Web';
      }
    }
    scrollDown(true);
  }

  function renderAttachmentPreview() {
    if (!els.attachmentPreview) return;
    if (pendingAttachments.length === 0) {
      els.attachmentPreview.hidden = true;
      els.attachmentPreview.innerHTML = '';
      return;
    }
    els.attachmentPreview.hidden = false;
    els.attachmentPreview.innerHTML = '';
    pendingAttachments.forEach((att, idx) => {
      const item = document.createElement('div');
      item.className = 'preview-item';
      if (att.type === 'image' && att.dataUrl) {
        item.innerHTML = `
          <img src="${att.dataUrl}" class="preview-thumb" alt="${att.name}" />
          <span>${att.name} <small>(${formatFileSize(att.size)})</small></span>
          <button type="button" class="preview-remove" data-idx="${idx}" title="Hapus">✕</button>
        `;
      } else {
        const icon = att.name.endsWith('.pdf') ? '📕' : att.name.endsWith('.doc') || att.name.endsWith('.docx') ? '📘' : att.name.endsWith('.zip') ? '📦' : '📄';
        item.innerHTML = `
          <span>${icon}</span>
          <span>${att.name} <small>(${formatFileSize(att.size)})</small></span>
          <button type="button" class="preview-remove" data-idx="${idx}" title="Hapus">✕</button>
        `;
      }
      els.attachmentPreview.appendChild(item);
    });
  }

  function bubble(role, html, { text, attachments } = {}) {
    const wrap = document.createElement('div');
    wrap.className = `msg ${role}`;
    const b = document.createElement('div');
    b.className = 'bubble';

    if (role === 'user') {
      if (attachments && attachments.length > 0) {
        const attContainer = document.createElement('div');
        attContainer.className = 'chat-attachments';
        attachments.forEach((att) => {
          if (att.type === 'image' && att.dataUrl) {
            const img = document.createElement('img');
            img.src = att.dataUrl;
            img.className = 'chat-img-thumb';
            img.alt = att.name;
            img.title = 'Klik untuk melihat gambar penuh';
            img.addEventListener('click', () => {
              window.open(att.dataUrl, '_blank');
            });
            attContainer.appendChild(img);
          } else {
            const icon = att.name.endsWith('.pdf') ? '📕' : att.name.endsWith('.doc') || att.name.endsWith('.docx') ? '📘' : att.name.endsWith('.zip') ? '📦' : '📄';
            const card = document.createElement('div');
            card.className = 'file-card';
            card.innerHTML = `
              <span class="file-card-icon">${icon}</span>
              <div class="file-card-info">
                <span class="file-card-name">${att.name}</span>
                <span class="file-card-size">${formatFileSize(att.size)}</span>
              </div>
            `;
            attContainer.appendChild(card);
          }
        });
        b.appendChild(attContainer);
      }
      if (text) {
        const textNode = document.createElement('div');
        textNode.textContent = text;
        b.appendChild(textNode);
      }
    } else {
      b.innerHTML = html;
    }

    wrap.appendChild(b);
    if (role === 'assistant') {
      const tools = document.createElement('div');
      tools.className = 'tools';
      tools.innerHTML = `
        <button type="button" data-copy title="Salin teks">📋 Salin</button>
        <button type="button" data-export="zip" title="Download Source Code / File Proyek (.zip)">📦 ZIP</button>
        <button type="button" data-export="ppt" title="Download Slide Presentasi (.html)">📽️ PPT</button>
        <button type="button" data-export="word" title="Download dokumen Word (.doc)">📄 Word</button>
        <button type="button" data-export="excel" title="Download tabel Excel (.csv)">📊 Excel</button>
        <button type="button" data-export="pdf" title="Cetak / Simpan ke PDF">📑 PDF</button>
      `;
      wrap.appendChild(tools);
    }
    return wrap;
  }

  const typingHtml = '<span class="typing" aria-label="Sedang mengetik"><i></i><i></i><i></i></span>';

  function paint(l) {
    if (!l.el) return;
    const b = l.el.querySelector('.bubble');
    b.innerHTML = l.text ? renderMarkdown(l.text) : typingHtml;
    scrollDown();
  }

  function renderEmptyMeeting() {
    const e = document.createElement('div');
    e.className = 'empty';
    e.innerHTML = `
      <b>Ruang Rapat Bersama Pak Fatsyah 👔</b>
      <div class="empty-role">Forum Diskusi & Kolaborasi Multi-Agen Lintas Divisi</div>
      <div style="font-size: 13px; color: var(--ink-soft); line-height: 1.6; margin-top: 10px; max-width: 520px; margin-inline: auto;">
        Selamat datang di ruang rapat virtual, Pak Fatsyah! Gunakan preset atau tambah/kick anggota di atas untuk menentukan fokus rapat (misal: <em>Semua Lead</em> untuk rekomendasi strategis, atau <em>Divisi Analis</em> untuk pemodelan). Setiap anggota aktif akan memberikan tanggapan secara berurutan sesuai keahliannya.
      </div>
    `;
    els.messages.appendChild(e);
    els.quick.innerHTML = '';
    const quicks = [
      'Minta rekomendasi dan strategi prioritas dari tiap lead untuk proyek kita',
      'Evaluasi kesiapan timeline, arsitektur, dan mitigasi risiko teknis',
      'Bagaimana rekomendasi pembagian tugas antar divisi minggu ini?',
    ];
    for (const q of quicks) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'q';
      btn.textContent = q;
      btn.addEventListener('click', () => submit(q));
      els.quick.appendChild(btn);
    }
  }

  function renderEmpty(agent) {
    const first = agent.name.split(' ')[0];
    const e = document.createElement('div');
    e.className = 'empty';
    const skillsHtml = (agent.skills || []).map((s) => `<button type="button" class="skill-badge" data-skill="${s}">⚡ ${s}</button>`).join(' ');
    e.innerHTML = `<b>Halo, gue ${first}</b><div class="empty-role">${agent.role} · ${agent.focus}</div>${skillsHtml ? `<div class="agent-skills-list">${skillsHtml}</div>` : ''}`;
    els.messages.appendChild(e);
    els.quick.innerHTML = '';
    for (const q of agent.quick) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'q';
      btn.textContent = q;
      btn.addEventListener('click', () => submit(q));
      els.quick.appendChild(btn);
    }
  }

  function render(agentId) {
    closeSlashPopup();
    if (agentId === 'meeting') {
      document.body.style.setProperty('--c', '#6366f1');
      els.avatar.style.setProperty('--c', '#6366f1');
      els.avatar.textContent = '👥';
      els.name.textContent = 'Ruang Rapat Bersama Pak Fatsyah';
      els.role.textContent = 'Forum Kolaborasi & Diskusi Multi-Agen';
      if (els.headToggleMeeting) els.headToggleMeeting.hidden = false;
      if (els.meetingBar) {
        els.meetingBar.hidden = false;
        setMeetingCollapsed(isMeetingCollapsed);
      }
      renderMeetingParticipants();

      if (els.agentList) {
        els.agentList.querySelectorAll('.agent-item').forEach((el) => el.classList.remove('active'));
      }
      if (els.openMeeting) els.openMeeting.classList.add('active');

      els.mates.innerHTML = '';
      els.messages.innerHTML = '';
      els.quick.innerHTML = '';
      const history = getHistory('meeting');
      const l = live.get('meeting');
      if (!history.length && !l) renderEmptyMeeting();
      for (const m of history) {
        els.messages.appendChild(
          m.role === 'user'
            ? bubble('user', '', { text: m.rawText || m.content, attachments: m.attachments })
            : bubble('assistant', renderMarkdown(m.content))
        );
      }
      if (l) {
        l.el = bubble('assistant', typingHtml);
        els.messages.appendChild(l.el);
        paint(l);
      }
      scrollDown(true);
      syncSend();
      return;
    }

    if (els.headToggleMeeting) els.headToggleMeeting.hidden = true;
    if (els.meetingBar) els.meetingBar.hidden = true;
    if (els.openMeeting) els.openMeeting.classList.remove('active');

    const agent = agentById(agentId);
    if (!agent) return;
    const div = divisionById(agent.division);
    document.body.style.setProperty('--c', div.color);
    els.avatar.style.setProperty('--c', div.color);
    els.avatar.textContent = initials(agent.name);
    els.name.textContent = agent.name;
    els.role.textContent = `${agent.role} · ${div.name}`;

    // Update active di sidebar list
    if (els.agentList) {
      els.agentList.querySelectorAll('.agent-item').forEach((el) => {
        el.classList.toggle('active', el.dataset.id === agentId);
      });
    }

    // rekan satu divisi
    els.mates.innerHTML = '';
    const team = agentsOf(agent.division);
    if (team.length > 1) {
      for (const m of team) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mate';
        b.style.setProperty('--c', div.color);
        b.setAttribute('aria-current', String(m.id === agentId));
        b.innerHTML = `<i>${initials(m.name)}</i>${m.name.split(' ')[0]}`;
        b.addEventListener('click', () => selectAndFocus(m.id));
        els.mates.appendChild(b);
      }
    }

    els.messages.innerHTML = '';
    els.quick.innerHTML = '';
    const history = getHistory(agentId);
    const l = live.get(agentId);
    if (!history.length && !l) renderEmpty(agent);
    for (const m of history) {
      els.messages.appendChild(m.role === 'user' ? bubble('user', '', { text: m.rawText || m.content, attachments: m.attachments }) : bubble('assistant', renderMarkdown(m.content)));
    }
    if (l) {
      l.el = bubble('assistant', typingHtml);
      els.messages.appendChild(l.el);
      paint(l);
    }
    scrollDown(true);
    syncSend();
  }

  function syncSend() {
    const busy = live.has(currentId);
    const hasText = Boolean(els.input.value.trim());
    const hasAtt = pendingAttachments.length > 0;
    els.send.disabled = busy || (!hasText && !hasAtt);
    if (currentId === 'meeting') {
      els.input.placeholder = busy
        ? 'Anggota rapat sedang menyusun tanggapan…'
        : 'Sampaikan agenda/arahan untuk forum rapat (Enter kirim)…';
    } else {
      const curAgent = currentId ? agentById(currentId) : null;
      els.input.placeholder = busy
        ? `${curAgent ? curAgent.name.split(' ')[0] : 'Karyawan'} lagi ngetik…`
        : 'Tulis pesan atau lampirkan file (Enter kirim)…';
    }
  }

  async function submit(text) {
    closeSlashPopup();
    const id = currentId;
    text = (text || '').trim();

    // Handle slash commands for meeting mode (e.g. /prof.bambang, /all, /bayu)
    if (id === 'meeting' && text.startsWith('/')) {
      const parts = text.split(/\s+/);
      const cmdRaw = parts.shift().slice(1); // remove leading '/'
      const remaining = parts.join(' ').trim();
      const match = findAgentByCommand(cmdRaw);

      if (match === 'all') {
        responseTargets = [...meetingParticipants];
        try { localStorage.setItem(MEETING_RULE_KEY, JSON.stringify({ type: 'all' })); } catch {}
        updateRuleDisplay();
        text = remaining;
      } else if (match && typeof match === 'object') {
        if (!meetingParticipants.includes(match.id)) {
          meetingParticipants.push(match.id);
          saveMeetingParticipants(meetingParticipants);
          renderMeetingParticipants();
        }
        responseTargets = [match.id];
        try { localStorage.setItem(MEETING_RULE_KEY, JSON.stringify({ id: match.id })); } catch {}
        updateRuleDisplay();
        text = remaining;
      }

      if (!text && pendingAttachments.length === 0) {
        els.input.value = '';
        autosize();
        syncSend();
        return;
      }
    }
    if (!id || (!text && pendingAttachments.length === 0) || live.has(id)) return;

    if (id === 'meeting' && meetingParticipants.length === 0) {
      alert('Silakan pilih minimal 1 anggota rapat di bilah atas sebelum mengirim pesan.');
      return;
    }

    const attachmentsToSend = [...pendingAttachments];
    pendingAttachments = [];
    renderAttachmentPreview();

    // Susun prompt yang menyertakan lampiran
    let promptToSend = text;
    if (attachmentsToSend.length > 0) {
      const parts = [];
      attachmentsToSend.forEach((att) => {
        if (att.isText && att.content) {
          parts.push(`--- Isi File Lampiran: ${att.name} ---\n\`\`\`\n${att.content.slice(0, 12000)}\n\`\`\``);
        } else if (att.type === 'image') {
          parts.push(`[Lampiran Gambar: ${att.name} (${formatFileSize(att.size)})]`);
        } else {
          parts.push(`[Lampiran File/Dokumen: ${att.name} (${formatFileSize(att.size)})]`);
        }
      });
      promptToSend = promptToSend ? `${promptToSend}\n\n${parts.join('\n\n')}` : parts.join('\n\n');
    }

    const history = getHistory(id);
    const userMsg = {
      role: 'user',
      content: promptToSend,
      rawText: text,
      attachments: attachmentsToSend.map((a) => ({
        type: a.type,
        name: a.name,
        size: a.size,
        dataUrl: a.type === 'image' ? a.dataUrl : undefined,
      })),
    };
    const sent = [...history, userMsg];
    setHistory(id, sent);

    els.messages.querySelector('.empty')?.remove();
    els.quick.innerHTML = '';
    els.messages.appendChild(bubble('user', '', { text, attachments: attachmentsToSend }));
    els.input.value = '';
    autosize();

    const l = { text: '', el: null, abort: new AbortController() };
    live.set(id, l);
    l.el = bubble('assistant', typingHtml);
    els.messages.appendChild(l.el);
    scrollDown(true);
    const activeTargets = id === 'meeting' ? responseTargets : [id];
    activeTargets.forEach((pid) => onStatus(pid, 'working'));
    syncSend();

    try {
      const full = await streamChat(id, sent, {
        signal: l.abort.signal,
        participantIds: id === 'meeting' ? responseTargets : undefined,
        crossContext: getCrossDivisionContext(id),
        onText: (_t, all) => {
          l.text = all;
          if (!l.raf) {
            l.raf = requestAnimationFrame(() => {
              l.raf = 0;
              paint(l);
            });
          }
        },
      });
      setHistory(id, [...sent, { role: 'assistant', content: full }]);
      live.delete(id);
      if (l.el && currentId === id) l.el.querySelector('.bubble').innerHTML = renderMarkdown(full);
      activeTargets.forEach((pid) => onStatus(pid, 'done'));
    } catch (err) {
      live.delete(id);
      activeTargets.forEach((pid) => onStatus(pid, 'idle'));
      if (err.name === 'AbortError') {
        setHistory(id, sent.slice(0, -1));
      } else {
        setHistory(id, sent.slice(0, -1));
        if (currentId === id) {
          l.el?.remove();
          const e = bubble('assistant', '');
          e.classList.add('error');
          e.querySelector('.bubble').textContent = err.message;
          e.querySelector('.tools')?.remove();
          els.messages.appendChild(e);
          els.input.value = text;
          autosize();
          scrollDown(true);
        }
        if (err.code === 401) onNeedCode();
      }
    } finally {
      if (currentId === id) syncSend();
    }
  }

  function autosize() {
    els.input.style.height = 'auto';
    els.input.style.height = `${Math.min(els.input.scrollHeight, 160)}px`;
  }

  // ---------- event ----------
  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    closeSlashPopup();
    submit(els.input.value);
  });
  els.input.addEventListener('input', () => {
    autosize();
    syncSend();

    const val = els.input.value;
    if (val.startsWith('/')) {
      const spaceIdx = val.indexOf(' ');
      if (spaceIdx === -1) {
        const query = val.slice(1);
        updateSlashPopup(query);
      } else {
        closeSlashPopup();
      }
    } else {
      closeSlashPopup();
    }
  });
  els.input.addEventListener('keydown', (e) => {
    if (isSlashOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        slashSelectedIndex = (slashSelectedIndex + 1) % slashFiltered.length;
        updateSlashHighlight();
        scrollSlashIntoView();
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        slashSelectedIndex = (slashSelectedIndex - 1 + slashFiltered.length) % slashFiltered.length;
        updateSlashHighlight();
        scrollSlashIntoView();
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (slashFiltered[slashSelectedIndex]) {
          selectSlashItem(slashFiltered[slashSelectedIndex]);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSlashPopup();
        return;
      }
    }

    if (e.key === 'Escape' && !els.input.value.trim()) {
      if (els.agentSearch) {
        e.preventDefault();
        els.agentSearch.focus();
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      closeSlashPopup();
      submit(els.input.value);
    }
  });

  document.addEventListener('click', (e) => {
    if (isSlashOpen && els.slashPopup && !els.slashPopup.contains(e.target) && e.target !== els.input) {
      closeSlashPopup();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (!isExpanded) toggleExpand(true);
      els.agentSearch?.focus();
      els.agentSearch?.select();
    }
  });

  if (els.expand) {
    els.expand.addEventListener('click', () => toggleExpand());
  }

  if (els.clearSearch) {
    els.clearSearch.addEventListener('click', () => {
      if (els.agentSearch) {
        els.agentSearch.value = '';
        els.clearSearch.hidden = true;
        renderAgentList('');
        highlightAgentItem(-1);
        els.agentSearch.focus();
      }
    });
  }

  if (els.agentSearch) {
    els.agentSearch.addEventListener('input', (e) => {
      if (els.clearSearch) {
        els.clearSearch.hidden = !e.target.value;
      }
      renderAgentList(e.target.value);
    });

    els.agentSearch.addEventListener('keydown', (e) => {
      const items = els.agentList?.querySelectorAll('.agent-item') || [];
      if (!items.length) {
        if (e.key === 'Enter' && els.openMeeting && els.openMeeting.style.display !== 'none') {
          e.preventDefault();
          selectAndFocus('meeting');
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = searchHighlightIndex < 0 ? 0 : Math.min(searchHighlightIndex + 1, items.length - 1);
        highlightAgentItem(nextIdx, true);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (searchHighlightIndex > 0) {
          highlightAgentItem(searchHighlightIndex - 1, true);
        } else {
          highlightAgentItem(-1);
          els.agentSearch.focus();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const targetIdx = searchHighlightIndex >= 0 ? searchHighlightIndex : 0;
        const targetEl = items[targetIdx];
        if (targetEl && targetEl.dataset.id) {
          selectAndFocus(targetEl.dataset.id);
        }
      } else if (e.key === 'Escape') {
        if (els.agentSearch.value) {
          e.preventDefault();
          els.agentSearch.value = '';
          renderAgentList('');
          highlightAgentItem(-1);
        }
      }
    });
  }

  if (els.attachBtn && els.fileInput) {
    els.attachBtn.addEventListener('click', () => els.fileInput.click());
    els.fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const dataUrl = await readImageAsDataUrl(file);
          pendingAttachments.push({
            type: 'image',
            name: file.name,
            size: file.size,
            dataUrl,
          });
        } else {
          const textInfo = await readFileContent(file);
          pendingAttachments.push({
            type: 'file',
            name: file.name,
            size: file.size,
            isText: textInfo.isText,
            content: textInfo.content,
          });
        }
      }
      els.fileInput.value = '';
      renderAttachmentPreview();
      syncSend();
    });
  }

  if (els.attachmentPreview) {
    els.attachmentPreview.addEventListener('click', (e) => {
      const rm = e.target.closest('.preview-remove');
      if (rm) {
        const idx = Number(rm.dataset.idx);
        pendingAttachments.splice(idx, 1);
        renderAttachmentPreview();
        syncSend();
      }
    });
  }

  els.close.addEventListener('click', () => onClose());
  els.reset.addEventListener('click', () => {
    if (!currentId) return;
    live.get(currentId)?.abort.abort();
    clearHistory(currentId);
    fetch('/api/sessions/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agentId: currentId }) }).catch(() => {});
    render(currentId);
  });

  const handleResetAll = () => {
    const ok = window.confirm(
      'Apakah Anda yakin ingin mereset seluruh sesi obrolan di SEMUA divisi?\\n\\nSemua riwayat percakapan dengan semua karyawan akan dibersihkan untuk memulai sesi topik baru.'
    );
    if (!ok) return;

    for (const [id, l] of live.entries()) {
      l.abort?.abort();
      onStatus(id, 'idle');
    }
    live.clear();
    clearAllHistory();
    clearHistory('meeting');
    fetch('/api/sessions/reset-all', { method: 'POST' }).catch(() => {});
    pendingAttachments = [];
    renderAttachmentPreview();
    if (currentId) {
      render(currentId);
    }
    renderAgentList(els.agentSearch?.value || '');
  };

  if (els.resetAll) {
    els.resetAll.addEventListener('click', handleResetAll);
  }
  if (els.sidebarResetAll) {
    els.sidebarResetAll.addEventListener('click', handleResetAll);
  }

  // Preset buttons & Kick button in meeting bar
  if (els.meetingBar) {
    els.meetingBar.addEventListener('click', (e) => {
      const presetBtn = e.target.closest('.preset-btn[data-preset]');
      if (presetBtn) {
        const p = presetBtn.dataset.preset;
        if (p === 'leads') {
          meetingParticipants = allLeaders().map((a) => a.id);
        } else if (p === 'clear') {
          meetingParticipants = [];
        } else {
          meetingParticipants = agentsOf(p).map((a) => a.id);
        }
        saveMeetingParticipants(meetingParticipants);
        renderMeetingParticipants();
        return;
      }

      const kickBtn = e.target.closest('.meeting-chip-kick');
      if (kickBtn) {
        const kid = kickBtn.dataset.id;
        meetingParticipants = meetingParticipants.filter((pid) => pid !== kid);
        saveMeetingParticipants(meetingParticipants);
        renderMeetingParticipants();
        return;
      }
    });
  }

  if (els.clearMeetingMembers) {
    els.clearMeetingMembers.addEventListener('click', () => {
      meetingParticipants = [];
      saveMeetingParticipants(meetingParticipants);
      renderMeetingParticipants();
    });
  }

  if (els.selectAddMember) {
    els.selectAddMember.addEventListener('change', (e) => {
      const newId = e.target.value;
      if (newId && !meetingParticipants.includes(newId)) {
        meetingParticipants.push(newId);
        saveMeetingParticipants(meetingParticipants);
        renderMeetingParticipants();
      }
      e.target.value = '';
    });
  }

  if (els.openMeeting) {
    els.openMeeting.addEventListener('click', () => {
      selectAndFocus('meeting');
    });
  }

  if (els.topbarMeeting) {
    els.topbarMeeting.addEventListener('click', () => {
      selectAndFocus('meeting');
    });
  }

  if (els.meetingToggleBody) {
    els.meetingToggleBody.addEventListener('click', () => {
      setMeetingCollapsed(!isMeetingCollapsed);
    });
  }

  if (els.headToggleMeeting) {
    els.headToggleMeeting.addEventListener('click', () => {
      setMeetingCollapsed(!isMeetingCollapsed);
    });
  }

  els.messages.addEventListener('click', async (e) => {
    const copyCode = e.target.closest('.copy');
    const copyMsg = e.target.closest('[data-copy]');
    const flash = (btn, t) => {
      const old = btn.textContent;
      btn.textContent = t;
      setTimeout(() => { btn.textContent = old; }, 1400);
    };
    const write = async (text, btn) => {
      try {
        await navigator.clipboard.writeText(text);
        flash(btn, 'Tersalin');
      } catch {
        flash(btn, 'Gagal');
      }
    };
    const skillBadge = e.target.closest('.skill-badge');
    if (skillBadge) {
      const skillName = skillBadge.dataset.skill;
      els.input.value = `Gunakan keahlian [${skillName}] untuk membantu saya: `;
      els.input.focus();
      return;
    }

    if (copyCode) write(copyCode.parentElement.querySelector('code').textContent, copyCode);
    else if (copyMsg) write(copyMsg.closest('.msg').querySelector('.bubble').innerText, copyMsg);

    const exportBtn = e.target.closest('[data-export]');
    if (exportBtn) {
      const type = exportBtn.dataset.export;
      const bubbleEl = exportBtn.closest('.msg').querySelector('.bubble');
      const agent = currentId === 'meeting' ? null : agentById(currentId);
      const agentTitle = agent ? `${agent.name} (${agent.role})` : (currentId === 'meeting' ? 'Ruang Rapat Bersama Pak Fatsyah' : 'Kantor AI');
      const filePrefix = currentId === 'meeting' ? 'Rapat-Tim' : (agent?.id || 'kantor');

      const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 300);
      };

      if (type === 'zip') {
        const zip = new JSZip();
        const codeBlocks = bubbleEl.querySelectorAll('pre code');
        let fileCount = 0;

        if (codeBlocks.length > 0) {
          codeBlocks.forEach((codeEl, idx) => {
            const fullCode = codeEl.textContent;
            const firstLine = fullCode.split('\n')[0].trim();
            let filename = '';
            const match = firstLine.match(/^(?:\/\/|#|<!--|\/\*)\s*([\w\-./\\]+\.[a-zA-Z0-9]+)/);
            if (match) {
              filename = match[1].replace(/^[/\\]+/, '');
            } else {
              const langClass = Array.from(codeEl.classList).find((c) => c.startsWith('language-')) || '';
              const ext = langClass.replace('language-', '') || 'txt';
              const cleanExt = ext === 'javascript' ? 'js' : ext === 'typescript' ? 'ts' : ext === 'python' ? 'py' : ext === 'php' ? 'php' : ext === 'html' ? 'html' : ext === 'css' ? 'css' : ext;
              filename = `file_${idx + 1}.${cleanExt}`;
            }
            zip.file(filename, fullCode);
            fileCount++;
          });
        }

        const clone = bubbleEl.cloneNode(true);
        clone.querySelectorAll('.copy, .tools').forEach((c) => c.remove());
        zip.file(
          'CATATAN-PROYEK.md',
          `# Catatan Tugas & Arsitektur - Vatio Corp\n\nDisusun oleh: ${agentTitle}\nTanggal: ${new Date().toLocaleString('id-ID')}\n\n${clone.innerText}`
        );

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(zipBlob, `Proyek-${filePrefix}-${Date.now()}.zip`);
        flash(exportBtn, `Tersimpan (${fileCount} kode + MD)`);
      } else if (type === 'ppt') {
        const clone = bubbleEl.cloneNode(true);
        clone.querySelectorAll('.copy, .tools').forEach((c) => c.remove());

        // Buat slide-slide presentasi dari konten
        const headings = clone.querySelectorAll('h1, h2, h3');
        const slides = [];

        if (headings.length > 0) {
          headings.forEach((h, i) => {
            let contentHtml = '';
            let next = h.nextElementSibling;
            while (next && !['H1', 'H2', 'H3'].includes(next.tagName)) {
              contentHtml += next.outerHTML;
              next = next.nextElementSibling;
            }
            slides.push({
              title: h.textContent,
              body: contentHtml || '<p>Poin penjelasan dari dokumen.</p>',
            });
          });
        }

        if (slides.length === 0) {
          // Fallback jika tidak ada heading
          slides.push({
            title: `Presentasi dari ${agentTitle}`,
            body: clone.innerHTML,
          });
        }

        const slidesHtml = slides.map((s, idx) => `
          <div class="slide ${idx === 0 ? 'active' : ''}">
            <h2>${s.title}</h2>
            <div class="slide-body">${s.body}</div>
          </div>
        `).join('');

        const presentationHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Presentasi - ${agentTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --accent: #6366f1; --sub: #94a3b8; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
    .slide-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 32px; }
    .slide { display: none; background: var(--card); border-radius: 16px; padding: 48px; width: 100%; max-width: 960px; min-height: 480px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08); flex-direction: column; }
    .slide.active { display: flex; animation: fade .2s ease-out; }
    @keyframes fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .slide h2 { font-size: 26px; color: #a5b4fc; margin-bottom: 20px; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
    .slide-body { font-size: 17px; line-height: 1.7; color: #e2e8f0; }
    .slide-body p { margin-bottom: 14px; }
    .slide-body ul, .slide-body ol { margin-left: 24px; margin-bottom: 14px; }
    .slide-body li { margin-bottom: 8px; }
    .slide-body pre { background: #0b1120; padding: 14px; border-radius: 8px; font-size: 13.5px; overflow-x: auto; margin: 12px 0; border: 1px solid #334155; }
    .slide-body code { font-family: monospace; color: #38bdf8; }
    .slide-body table { border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 14px; }
    .slide-body th, .slide-body td { border: 1px solid #334155; padding: 8px 12px; }
    .slide-body th { background: #1e293b; color: #818cf8; }
    .nav { height: 64px; background: rgba(15, 23, 42, 0.95); border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
    .nav-btn { background: #334155; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13.5px; }
    .nav-btn:hover { background: #475569; }
    .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .counter { font-size: 14px; color: var(--sub); font-weight: 600; }
  </style>
</head>
<body>
  <div class="slide-container" id="slides">${slidesHtml}</div>
  <div class="nav">
    <div style="font-size: 13px; color: var(--sub);">Presenter: ${agentTitle} · Navigasi: [← / → / Spasi]</div>
    <div style="display:flex; align-items:center; gap:12px;">
      <button class="nav-btn" id="prev-btn">← Sebelumnya</button>
      <span class="counter" id="slide-num">1 / ${slides.length}</span>
      <button class="nav-btn" id="next-btn">Berikutnya →</button>
    </div>
  </div>
  <script>
    let cur = 0;
    const slides = document.querySelectorAll('.slide');
    const total = slides.length;
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const counter = document.getElementById('slide-num');
    function update() {
      slides.forEach((s, i) => s.classList.toggle('active', i === cur));
      counter.textContent = (cur + 1) + ' / ' + total;
      prevBtn.disabled = cur === 0;
      nextBtn.disabled = cur === total - 1;
    }
    prevBtn.onclick = () => { if (cur > 0) { cur--; update(); } };
    nextBtn.onclick = () => { if (cur < total - 1) { cur++; update(); } };
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        if (cur < total - 1) { cur++; update(); }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (cur > 0) { cur--; update(); }
      }
    });
    update();
  </script>
</body>
</html>`;
        const pptBlob = new Blob([presentationHtml], { type: 'text/html;charset=utf-8' });
        downloadBlob(pptBlob, `Presentasi-${filePrefix}-${Date.now()}.html`);
        flash(exportBtn, `Tersimpan (${slides.length} Slide)`);
      } else if (type === 'word') {
        const clone = bubbleEl.cloneNode(true);
        clone.querySelectorAll('.copy, .tools').forEach((c) => c.remove());
        const html = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head><meta charset='utf-8'><title>Dokumen Kantor AI</title>
          <style>
            body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; }
            h1, h2, h3 { color: #0f172a; margin-top: 18pt; margin-bottom: 6pt; }
            table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
            th, td { border: 1px solid #cbd5e1; padding: 6pt 8pt; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; }
            pre, code { font-family: Consolas, monospace; background: #f8fafc; font-size: 10pt; }
            blockquote { border-left: 3pt solid #3b82f6; padding-left: 8pt; color: #475569; }
          </style>
          </head>
          <body>
            <h2 style="color: #4f46e5; margin-bottom: 4pt;">Dokumen Kantor AI</h2>
            <p style="font-size: 10pt; color: #64748b;"><em>Disusun oleh: ${agentTitle} · Tanggal: ${new Date().toLocaleDateString('id-ID')}</em></p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 12pt 0;"/>
            ${clone.innerHTML}
          </body>
          </html>`;
        const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
        downloadBlob(blob, `Dokumen-${filePrefix}-${Date.now()}.doc`);
        flash(exportBtn, 'Tersimpan');
      } else if (type === 'excel') {
        const tables = bubbleEl.querySelectorAll('table');
        let csv = '';
        if (tables.length > 0) {
          tables.forEach((tbl, idx) => {
            if (idx > 0) csv += '\r\n\r\n';
            tbl.querySelectorAll('tr').forEach((tr) => {
              const cells = Array.from(tr.querySelectorAll('th, td')).map((td) => `"${td.innerText.replace(/"/g, '""').trim()}"`);
              csv += cells.join(',') + '\r\n';
            });
          });
        } else {
          const lines = bubbleEl.innerText.split('\n').map((l) => l.trim()).filter(Boolean);
          csv = lines.map((l) => `"${l.replace(/"/g, '""')}"`).join('\r\n');
        }
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, `Data-${filePrefix}-${Date.now()}.csv`);
        flash(exportBtn, 'Tersimpan');
      } else if (type === 'pdf') {
        const clone = bubbleEl.cloneNode(true);
        clone.querySelectorAll('.copy, .tools').forEach((c) => c.remove());

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const printDoc = iframe.contentWindow.document;
        printDoc.open();
        printDoc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Cetak Dokumen - Kantor AI</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
              .header { border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px; }
              .header h1 { margin: 0 0 4px 0; font-size: 22px; color: #312e81; }
              .meta { font-size: 13px; color: #64748b; }
              table { border-collapse: collapse; width: 100%; margin: 16px 0; }
              th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
              th { background: #f8fafc; font-weight: 600; }
              pre { background: #f1f5f9; padding: 12px; border-radius: 6px; overflow-x: auto; }
              code { font-family: monospace; font-size: 13px; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Dokumen / Notulensi Kantor AI</h1>
              <div class="meta">Disusun oleh: ${agentTitle} · ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</div>
            </div>
            <div class="content">${clone.innerHTML}</div>
          </body>
          </html>
        `);
        printDoc.close();
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          setTimeout(() => {
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
          }, 2000);
        }, 300);
        flash(exportBtn, 'Dicetak');
      }
    }
  });

  return {
    open(agentId) {
      currentId = agentId;
      render(agentId);
      if (isDemo()) document.getElementById('banner').hidden = false;
      setTimeout(() => {
        if (matchMedia('(hover: hover)').matches) els.input.focus({ preventScroll: true });
      }, 80);
    },
    close() {
      currentId = null;
    },
    get current() {
      return currentId;
    },
  };
}
