const tips = [
  "Did you know this obfuscator avoids loadstring?",
  "Did you know obfuscation slows reverse engineering?",
  "Did you know tables make static analysis harder?",
  "Did you know this uses string reconstruction?",
  "Did you know multiple layers increase security?"
];

const obfBtn = document.getElementById("obfBtn");
const process = document.getElementById("process");
const result = document.getElementById("result");
const progress = document.getElementById("progress");
const percent = document.getElementById("percent");
const dots = document.getElementById("dots");
const tip = document.getElementById("tip");
const output = document.getElementById("output");

let dotCount = 1;

setInterval(() => {
  dotCount = (dotCount % 3) + 1;
  dots.textContent = ".".repeat(dotCount);
}, 500);

obfBtn.onclick = () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Choose a .lua file");

  const reader = new FileReader();
  reader.onload = () => startObfuscation(reader.result);
  reader.readAsText(file);
};

function startObfuscation(code) {
  process.classList.remove("hidden");
  tip.textContent = tips[Math.floor(Math.random() * tips.length)];

  let p = 0;
  const timer = setInterval(() => {
    p += Math.random() * 12;
    if (p >= 100) {
      p = 100;
      clearInterval(timer);
      finish(code);
    }
    progress.style.width = p + "%";
    percent.textContent = Math.floor(p);
  }, 300);
}

function finish(code) {
  const obf = obfuscateLua(code);
  output.value = obf;
  process.classList.add("hidden");
  result.classList.remove("hidden");
}

function obfuscateLua(lua) {
  const chars = [...lua].map(c => c.charCodeAt(0));
  return `
local _m = {}
_m.d = {${chars.join(",")}}

local function _r(t)
  local s = ""
  for i=1,#t do
    s = s .. string.char(t[i])
  end
  return s
end

local function _e()
  local f = _r(_m.d)
  local ok,err = pcall(function()
    local g = getfenv(0)
    g["print"] = print
    assert(load ~= nil)
    load(f)()
  end)
end

_e()
`;
}

function copyCode() {
  navigator.clipboard.writeText(output.value);
}

function downloadCode() {
  const blob = new Blob([output.value], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "obfuscated.lua";
  a.click();
}
