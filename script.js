let dots = 0;
document.getElementById("obfBtn").onclick = start;

function start() {
  const input = document.getElementById("fileInput");
  const file = input.files && input.files[0];

  if (!file) {
    alert("Please select a .lua or .txt file");
    return;
  }

  const reader = new FileReader();

  reader.onerror = () => alert("Failed to read file");

  reader.onload = () => {
    const content = reader.result;
    if (!content || content.trim().length === 0) {
      alert("File is empty or unsupported");
      return;
    }
    process(content);
  };

  reader.readAsText(file);
}

function process(code) {
  const status = document.getElementById("status");
  const bar = document.getElementById("bar");
  const out = document.getElementById("output");
  const actions = document.getElementById("actions");

  out.style.display = "none";
  actions.style.display = "none";
  bar.style.width = "0%";

  let p = 0;
  const interval = setInterval(() => {
    dots = (dots + 1) % 4;
    status.textContent = "Obfuscating" + ".".repeat(dots);
    p += Math.random() * 18;
    bar.style.width = Math.min(p, 100) + "%";

    if (p >= 100) {
      clearInterval(interval);
      out.value = obfuscate(code);
      out.style.display = "block";
      actions.style.display = "flex";
      status.textContent = "Completed";
    }
  }, 220);
}

function obfuscate(lua) {
  const chars = [...lua].map(c => c.charCodeAt(0));
  const checksum = chars.reduce((a,b,i)=> (a + b*(i+1)) % 1000000007, 0);

  return `
--([[This File Was Protected By MZ Obfuscator v0.0.2 • dsc.gg/mzzhub]])

local _d={${chars.join(",")}}
local _h=${checksum}

local function _chk(t)
  local r=0
  for i=1,#t do
    r=(r+t[i]*i)%1000000007
  end
  return r
end

if not game or not typeof or typeof(game)~="Instance" then return end
if _chk(_d)~=_h then return end

local function _run()
  local s=""
  for i=1,#_d do
    s=s..string.char(_d[i])
  end
  local f=load(s)
  if f then f() end
end

pcall(_run)
`;
}

function copyText() {
  navigator.clipboard.writeText(document.getElementById("output").value);
}

function download() {
  const text = document.getElementById("output").value;
  const blob = new Blob([text], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "obfuscated.lua";
  a.click();
}
