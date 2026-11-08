#!/usr/bin/env bash
# Vatio Corp: Quick Memory Status Inspector
# Fokus: Efisiensi Konteks, Minimalis, dan Kemudahan Audit (Graphify Ready)

echo "================================================="
echo "        STATUS TIERED MEMORY VATIO CORP         "
echo "================================================="
echo ""
echo "[TIER 1] MASTER BLUEPRINT:"
echo "Location: ./sys-agents/SYSTEM_CONTEXT.md"
if [ -f "./sys-agents/SYSTEM_CONTEXT.md" ]; then
  head -n 14 ./sys-agents/SYSTEM_CONTEXT.md
else
  echo "File belum dibuat."
fi
echo "-------------------------------------------------"
echo "[TIER 2] SPRINT WORKING MEMORY:"
echo "Location: ./sys-agents/SPRINT_LOG.md"
if [ -f "./sys-agents/SPRINT_LOG.md" ]; then
  ls -lh ./sys-agents/SPRINT_LOG.md
  echo "Preview Log:"
  head -n 8 ./sys-agents/SPRINT_LOG.md
else
  echo "File belum dibuat."
fi
echo "-------------------------------------------------"
echo "[TIER 3] COLD ARCHIVE SUMMARY:"
echo "Location: ./sys-agents/archive/"
if [ -d "./sys-agents/archive" ]; then
  ARCHIVE_COUNT=$(ls -1 ./sys-agents/archive/HISTORY_*.md 2>/dev/null | wc -l)
  echo "Jumlah File Arsip: $ARCHIVE_COUNT"
  ls -lh ./sys-agents/archive/ 2>/dev/null
else
  echo "Direktori archive belum ada."
fi
echo "================================================="
echo "9Router Protocol: Ready | Graphify Sync: Active"
echo "================================================="
