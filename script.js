let dots = 0;

function start() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => process(reader.result);
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
    p += Math.random() * 15;
    bar.style.width = Math.min(p,100) + "%";

    if (p >= 100) {
      clearInterval(interval);
      out.value = obfuscate(code);
      out.style.display = "block";
      actions.style.display = "flex";
      status.textContent = "Completed";
    }
  }, 250);
}

function obfuscate(lua) {
  const chars = [...lua].map(c => c.charCodeAt(0));
  const checksum = chars.reduce((a,b,i)=> (a + b*(i+1))%1000000007,0);

  return `
--([[This File Was Protected By MZ Obfuscator v0.0.2 • dsc.gg/mzzhub]])

local _d={${chars.join(",")}}
local _h=${checksum}

local function _c(t)
  local r=0
  for i=1,#t do
    r=(r+t[i]*i)%1000000007
  end
  return r
end

if not game or not typeof or typeof(game)~="Instance" then return end
if _c(_d)~=_h then return end

local function _r()
  local s=""
  for i=1,#_d do
    s=s..string.char(_d[i])
  end
  return s
end

pcall(function()
  local f=load(_r())
  if f then f() end
end)
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
