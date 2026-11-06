// 9Router API integration (OpenAI-compatible local AI gateway)

const NINEROUTER_API_KEY = process.env.NINEROUTER_API_KEY || '';
const NINEROUTER_BASE = (process.env.NINEROUTER_BASE_URL || 'http://localhost:20128/v1').replace(/\/+$/, '');

export function isNineRouter(model) {
  // Semua model diarahkan ke 9Router
  return true;
}

export function nineRouterBase() {
  return {
    base: NINEROUTER_BASE,
    configured: Boolean(NINEROUTER_API_KEY) || NINEROUTER_BASE.includes('localhost'),
  };
}

export async function streamNineRouter({ model, system, messages, maxTokens = 1500, signal, onText }) {
  const actualModel = model.replace(/^(9router:|ninerouter:)/, '') || 'default';

  const payload = {
    model: actualModel,
    messages: [
      { role: 'system', content: system },
      ...messages,
    ],
    max_tokens: maxTokens,
    stream: true,
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  if (NINEROUTER_API_KEY) {
    headers['Authorization'] = `Bearer ${NINEROUTER_API_KEY}`;
  }

  const endpoint = `${NINEROUTER_BASE}/chat/completions`;

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw Object.assign(
      new Error(`Tidak bisa menghubungi 9Router di ${NINEROUTER_BASE}. Pastikan 9Router sudah aktif (port 20128).`),
      { ninerouter: true }
    );
  }

  if (!response.ok) {
    const text = await response.text();
    let msg = `9Router error (${response.status}): ${text}`;
    try {
      const errObj = JSON.parse(text);
      if (errObj.error?.message) {
        msg = `9Router (${response.status}): ${errObj.error.message}`;
      }
    } catch {}
    throw Object.assign(new Error(msg), { ninerouter: true, status: response.status });
  }

  return new Promise((resolve, reject) => {
    let totalText = '';
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    async function read() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((line) => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  totalText += content;
                  onText(content);
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
        }

        const inputEst = Math.ceil((system.length + messages.map((m) => m.content).join('').length) / 4);
        const outputEst = Math.ceil(totalText.length / 4);
        resolve({ input: inputEst, output: outputEst });
      } catch (err) {
        if (signal?.aborted) {
          resolve({ input: 0, output: 0 });
        } else {
          reject(Object.assign(err, { ninerouter: true }));
        }
      }
    }

    read();
  });
}
