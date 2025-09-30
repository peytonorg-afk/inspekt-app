type Item = { inspectionId: string; file: File };
const q: Item[] = [];
let running = false;

export function enqueue(i: Item) {
  q.push(i);
  run();
}

function online() {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

async function run() {
  if (running) return;
  running = true;
  while (q.length) {
    if (!online()) {
      await new Promise((r) => setTimeout(r, 1500));
      continue;
    }
    const { inspectionId, file } = q[0];
    try {
      const presign = await fetch("/api/photos/presign", { method: "POST" }).then((r) => r.json());
      await fetch(`/api/inspections/${inspectionId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: presign.key, fileName: file.name, bytes: file.size }),
      });
      q.shift();
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  running = false;
}


