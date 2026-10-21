# Application Load Balancer Visual

An animated, beginner-friendly AWS Application Load Balancer (ALB) visualizer that follows Ravi's online shop. It uses plain HTML, CSS, JavaScript, and inline SVG—no framework, package install, or build step.

**Branding:** `#Buildwithmohit`

## Project goals

- Explain ALB routing with a receptionist analogy for people new to cloud computing.
- Reveal a nine-step architecture progressively.
- Animate request/response packets and show healthy/unhealthy target behavior.
- Provide Play, Pause, Reset, next-step navigation, a simulated EC2 failure, and a light/dark theme toggle.
- Work on desktop and mobile, including horizontally scrollable step navigation and diagram.

## AWS concepts covered

- **Amazon Route 53 (DNS):** maps a domain name to an ALB DNS name, commonly using an alias record.
- **Application Load Balancer:** a Layer 7 load balancer for HTTP/HTTPS traffic.
- **Listeners and rules:** listen on ports such as 80 (HTTP) and 443 (HTTPS), then evaluate routing rules.
- **Target group:** the registered destinations—here, EC2 web servers.
- **Availability Zones:** distribute capacity across zones to improve resilience.
- **Health checks:** determine whether registered targets are healthy; ALB routes new requests only to healthy targets when healthy targets are available.
- **Auto Scaling Group:** can add or remove EC2 capacity and register new instances with a target group.
- **Security groups:** use least-privilege rules; the ALB security group should allow intended client traffic and target security groups should allow application traffic from the ALB.
- **HTTPS/TLS termination:** in this example TLS is shown ending at the ALB listener. The ALB can then forward traffic to targets over HTTP or HTTPS depending on configuration.
- **Amazon CloudWatch:** provides metrics and alarms for monitoring.

> This is an educational illustration, not a live AWS deployment. Actual routing behavior depends on listener rules, target health, target-group settings, network configuration, and available healthy targets.

## The nine steps

1. **Visitors** — customers open Ravi's shopping website through the internet.
2. **DNS** — Route 53 resolves the domain to the load balancer endpoint.
3. **Application Load Balancer** — the receptionist accepts incoming HTTP/HTTPS requests.
4. **Listener** — listeners use ports 80 and 443 and apply listener rules.
5. **Target Group** — two EC2 web servers are registered as targets.
6. **Traffic Distribution** — requests are sent to healthy targets in two Availability Zones.
7. **Health Checks** — simulate an unhealthy server and see the new-request route shift to healthy targets.
8. **Scaling** — a third EC2 instance is added through an Auto Scaling Group and joins after registration/health checks.
9. **Complete Architecture** — review Route 53, ALB, listener, target group, EC2 targets, security groups, TLS termination, and CloudWatch.

## Moving-object legend

- **Envelope** — incoming HTTP request.
- **Shopping cart** — customer request.
- **Green check** — healthy target.
- **Red cross** — unhealthy target.
- **Package** — server response.
- **Shield** — HTTPS/TLS security.
- **Chart** — CloudWatch monitoring activity.

The packets are SVG groups animated along paths using `<animateMotion>` and `<mpath>`. SVG wires are drawn before component boxes, and moving packets are layered last.

## Run locally

Requires Python 3, already available on many development systems.

```bash
cd application-load-balancer-visual
python3 -m http.server 8000
```

Open <http://localhost:8000> in your browser. On Windows, `py -m http.server 8000` is an alternative.

## Publish with GitHub Pages

1. Create a GitHub repository named `application-load-balancer-visual` and upload/push the contents of this folder to the repository root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save. Wait for the published URL shown on the Pages settings screen.

The `.nojekyll` file helps GitHub Pages serve the project without Jekyll processing.

## Project structure

```text
application-load-balancer-visual/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── .nojekyll
├── LICENSE
└── README.md
```

## Controls

- **Play:** automatically advances every five seconds.
- **Pause:** stops automatic advancement.
- **Reset:** returns to step 1 and restores the simulated target.
- **Step selection / Next step:** reveal all components up to the selected step.
- **Simulate EC2 failure:** marks EC2 Web 2 unhealthy and illustrates rerouting. Press again to restore it after a simulated successful health check.
- **Theme:** switches between dark and light page themes.

The failure button is a local visual simulation only; it does not change any real AWS resource.

## Customisation

- Edit the `lessons` array in `js/app.js` to change each step's title and explanatory copy.
- Edit the SVG inside `index.html` to change architecture nodes, paths, colors, or moving objects.
- Update `data-min-step` on SVG groups to control when components appear.
- Adjust design tokens at the top of `css/style.css` and the responsive breakpoints near the bottom.
- Change the branding by replacing `#Buildwithmohit` in `index.html` and this README.

## Accessibility and compatibility

- Semantic buttons include accessible labels, and the SVG has a title and description.
- Supports keyboard-accessible step and simulation buttons.
- Respects `prefers-reduced-motion` by reducing SVG and CSS motion.
- Responsive layout includes horizontal scrolling for the step navigation and diagram on smaller screens.

## License

Released under the MIT License. See [`LICENSE`](LICENSE).
