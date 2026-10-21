(() => {
  "use strict";
  const lessons = [
    {title:"Visitors",headline:"Visitors arrive at Ravi’s shop",plain:"Customers open Ravi’s website, just like walking up to a busy shop.",technical:"Client / internet request",watch:"Blue visitors represent customers arriving from the internet."},
    {title:"DNS",headline:"DNS finds the right address",plain:"Route 53 is like the shop directory. It helps the browser find the load balancer for Ravi’s domain.",technical:"Amazon Route 53 DNS alias record",watch:"The blue route now includes Route 53 before traffic reaches the ALB."},
    {title:"Application Load Balancer",headline:"Meet the receptionist",plain:"The receptionist greets every visitor and decides which available staff member should help.",technical:"Application Load Balancer (ALB), Layer 7",watch:"The teal ALB accepts HTTP or HTTPS requests and can route by request details."},
    {title:"Listener",headline:"The listener checks the door",plain:"The listener watches specific doors: port 80 for HTTP and port 443 for HTTPS. Rules decide where each request goes.",technical:"Listener + listener rules",watch:"The gold listener represents ports 80/443 and rules such as host- or path-based routing."},
    {title:"Target Group",headline:"Create a team of web servers",plain:"The receptionist has a team list. Ravi starts with two web servers that can serve the shop.",technical:"Target group with registered EC2 targets",watch:"The purple target group contains EC2 Web 1 and EC2 Web 2."},
    {title:"Traffic Distribution",headline:"Share the customer queue",plain:"The receptionist sends each new customer to an available server, across separate Availability Zones.",technical:"ALB routing to healthy targets across AZs",watch:"Moving request packets travel toward healthy servers in AZ A and AZ B."},
    {title:"Health Checks",headline:"Skip a server that feels unwell",plain:"The ALB checks whether each server responds. If one fails its checks, new requests go to healthy targets instead.",technical:"Target health checks and healthy-target routing",watch:"Use “Simulate EC2 failure” to turn Web 2 red and watch traffic reroute."},
    {title:"Scaling",headline:"Bring in another team member",plain:"When the shop needs more capacity, an Auto Scaling Group can add another server. It receives traffic after it registers and passes health checks.",technical:"EC2 Auto Scaling + target registration",watch:"EC2 Web 3 joins the target group as a healthy target."},
    {title:"Complete Architecture",headline:"The whole shop works together",plain:"DNS points customers to the ALB. The ALB secures and routes requests to healthy servers, while monitoring helps the team spot problems.",technical:"Route 53 → ALB listener → target group → EC2; TLS, security groups, CloudWatch",watch:"Review the full flow, security boundary, HTTPS/TLS termination, and monitoring components."}
  ];
  const navButtons = [...document.querySelectorAll(".step-item")];
  const nodes = [...document.querySelectorAll("#architecture .node")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = {step:1,playing:false,timer:null,failed:false};
  const $ = id => document.getElementById(id);

  function renderStep(step) {
    state.step = Math.max(1, Math.min(9, step));
    const lesson = lessons[state.step - 1];
    navButtons.forEach(button => {
      const active = Number(button.dataset.step) === state.step;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    nodes.forEach(node => {
      const minStep = Number(node.dataset.minStep || 1);
      const visible = minStep <= state.step;
      node.classList.toggle("revealed", visible);
      node.classList.toggle("hidden-node", !visible);
      if (visible) node.removeAttribute("aria-hidden");
      else node.setAttribute("aria-hidden", "true");
    });
    $("stepCounter").textContent = `${String(state.step).padStart(2,"0")} / 09`;
    $("diagramStatus").textContent = `STEP ${state.step} OF 9`;
    $("activeTitle").textContent = `${String(state.step).padStart(2,"0")} · ${lesson.title}`;
    $("captionTitle").textContent = lesson.headline;
    $("plainWords").textContent = lesson.plain;
    $("technicalName").textContent = lesson.technical;
    $("watchPicture").textContent = lesson.watch;
    $("progressText").textContent = `${state.step} of 9 concepts explored`;
    $("progressBar").style.width = `${state.step / 9 * 100}%`;
    $("nextBtn").innerHTML = state.step === 9 ? 'Back to start <span>↺</span>' : 'Next step <span>→</span>';
    if (state.step >= 7) updateFailureVisuals();
    const active = document.querySelector(".step-item.active");
    if (active && window.innerWidth < 780) active.scrollIntoView({block:"nearest",inline:"nearest",behavior:reducedMotion?"auto":"smooth"});
  }
  function stopAuto() {
    state.playing = false;
    if (state.timer) window.clearInterval(state.timer);
    state.timer = null;
    $("playBtn").setAttribute("aria-pressed","false");
  }
  function playAuto() {
    stopAuto();
    state.playing = true;
    $("playBtn").setAttribute("aria-pressed","true");
    state.timer = window.setInterval(() => renderStep(state.step >= 9 ? 1 : state.step + 1), 5000);
  }
  function updateFailureVisuals() {
    const server = $("server2");
    server.classList.toggle("failed", state.failed);
    $("failureBadge").style.opacity = state.failed ? "1" : "0";
    $("failureStatus").textContent = state.failed ? "Web 2 unhealthy · new requests rerouted to healthy targets" : "All simulated targets healthy";
    $("failureStatus").classList.toggle("warning", state.failed);
    $("failureBtn").textContent = state.failed ? "Restore server + health check" : "Simulate EC2 failure";
    $("failureBtn").setAttribute("aria-pressed", String(state.failed));
    const packets = document.querySelectorAll(".packet");
    packets.forEach((packet, index) => {
      if (index === 1 && state.failed) packet.style.opacity = ".25";
      else packet.style.opacity = "";
    });
    const paths = $("wires").querySelectorAll("path");
    if (paths[5]) {
      paths[5].setAttribute("stroke", state.failed ? "#ff6579" : "#41d6a0");
      paths[5].setAttribute("stroke-dasharray", state.failed ? "3 9" : "7 8");
      paths[5].setAttribute("opacity", state.failed ? ".3" : "1");
    }
  }
  navButtons.forEach(button => button.addEventListener("click", () => {
    stopAuto();
    renderStep(Number(button.dataset.step));
  }));
  $("playBtn").addEventListener("click", playAuto);
  $("pauseBtn").addEventListener("click", stopAuto);
  $("resetBtn").addEventListener("click", () => {
    stopAuto(); state.failed = false; updateFailureVisuals(); renderStep(1);
  });
  $("nextBtn").addEventListener("click", () => {
    stopAuto();
    if (state.step === 9) { state.failed = false; updateFailureVisuals(); renderStep(1); }
    else renderStep(state.step + 1);
  });
  $("failureBtn").addEventListener("click", () => {
    state.failed = !state.failed;
    updateFailureVisuals();
    if (state.step < 7) renderStep(7);
  });
  $("themeToggle").addEventListener("click", () => {
    const light = document.body.classList.toggle("light");
    $("themeToggle").setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    $("themeToggle").innerHTML = light ? "☾ <span>Theme</span>" : "☼ <span>Theme</span>";
  });
  if (reducedMotion) {
    document.querySelectorAll("#architecture animateMotion").forEach(animation => animation.setAttribute("repeatCount","1"));
    document.querySelectorAll("#wires path").forEach(path => path.style.animation = "none");
  }
  renderStep(1);
  // Keep the animated lesson running automatically, as requested.
  playAuto();
})();