/**
 * AdoTeam - Dynamic Data Hydration & Module Showcase
 * Uses pre-made CSS classes, variables, and design system.
 */
document.addEventListener("DOMContentLoaded", () => {
  let hrmsData = null;

  const moduleWrapper = document.getElementById("hrmsModulesWrapper");
  const modalEl = document.getElementById("hrmsDetailModal");
  let bsModal = null;
  if (modalEl && typeof bootstrap !== "undefined") {
    bsModal = new bootstrap.Modal(modalEl);
  }

  // Fetch HRMS data asynchronously
  async function loadHrmsData() {
    try {
      const response = await fetch("data/hrms-data.json");
      if (!response.ok) throw new Error("HTTP " + response.status);
      hrmsData = await response.json();
      renderModules(hrmsData.modules || []);
    } catch (err) {
      console.warn("Falling back to internal data for HRMS:", err);
      // Resilient fallback dataset if network fetch is blocked
      const fallbackModules = [
        {
          id: "dashboard",
          num: "01",
          title: "Dashboard",
          badge: "Control Center",
          description: "Real-time workforce presence cockpit, shift coverage counters, and quick employee actions.",
          features: ["Real-time presence feed", "1-Click mobile punch status", "Upcoming shift schedules & birthdays"],
          tags: ["Real-Time Feed", "Action Center", "Live Headcount"],
          statVal: "100%",
          statLbl: "Live visibility",
          pexelsQuery: "Dashboard HRMS analytics computer screen modern office management",
          icon: "fa-gauge-high"
        },
        {
          id: "employee-management",
          num: "02",
          title: "Employee Management",
          badge: "Workforce Master",
          description: "Paperless digital onboarding, confidential KYC records, asset tracking, and searchable directory.",
          features: ["E-sign offer letters & KYC docs", "Hierarchical org directory", "Hardware asset assignments"],
          tags: ["Digital KYC", "Org Directory", "Asset Tracking"],
          statVal: "3x Faster",
          statLbl: "Onboarding Speed",
          pexelsQuery: "Employee Management HR onboarding corporate professional staff",
          icon: "fa-users-gear"
        },
        {
          id: "attendance-management",
          num: "03",
          title: "Attendance Management (Punch In / Punch Out via Geo-Location)",
          badge: "Geo-Fenced Clock-In",
          description: "Precision mobile clock-in/out with GPS boundary enforcement, facial selfie check, and biometric cloud sync.",
          features: ["Geo-fence boundary (10m-500m)", "Biometric sync (eSSL, ZKTeco)", "Overtime & late-in tracking"],
          tags: ["GPS Geo-Fencing", "Zero Proxy", "Biometric Sync"],
          statVal: "99.8%",
          statLbl: "GPS Accuracy",
          pexelsQuery: "Attendance Management Punch In Punch Out via Geo Location smartphone office clock in",
          icon: "fa-location-dot"
        },
        {
          id: "leave-management",
          num: "04",
          title: "Leave Management & Approval",
          badge: "Policy Automation",
          description: "Automated leave quota ledgers (CL, SL, PL), sandwich rule calculations, and 1-click multi-tier manager approvals.",
          features: ["Real-time leave balance ledgers", "Sandwich weekend policy rules", "Instant push & email approvals"],
          tags: ["Multi-Tier Flow", "Sandwich Rules", "Real-Time Balance"],
          statVal: "4.8x",
          statLbl: "Approval Velocity",
          pexelsQuery: "Leave Management & Approval calendar laptop vacation time off office",
          icon: "fa-calendar-check"
        },
        {
          id: "regularization-management",
          num: "05",
          title: "Regularization Management",
          badge: "Audit & Compliance",
          description: "Frictionless workflow for missed punches, biometric hardware discrepancies, and outdoor client visits.",
          features: ["Outdoor Duty (OD) logs", "Missed punch request flow", "Detailed HR audit trails"],
          tags: ["Missed Punch", "OD Tracking", "Audit Logs"],
          statVal: "-94%",
          statLbl: "Dispute Rate",
          pexelsQuery: "Regularization Management dispute approval attendance audit office tablet",
          icon: "fa-clock-rotate-left"
        },
        {
          id: "team-mates",
          num: "06",
          title: "Team Mates",
          badge: "Team Collaboration",
          description: "Visual reporting lines, skill matrices, peer presence indicators (Office, Remote, Leave), and shift collaboration.",
          features: ["Visual reporting lines", "Real-time presence tags", "Departmental contact directory"],
          tags: ["Org Hierarchy", "Live Presence", "Skill Matrix"],
          statVal: "1-Click",
          statLbl: "Team Discovery",
          pexelsQuery: "Team Mates corporate office diverse team collaboration colleagues meeting",
          icon: "fa-people-group"
        },
        {
          id: "calendar",
          num: "07",
          title: "Calendar",
          badge: "Roster Management",
          description: "Multi-branch holiday rosters, 24/7 rotational shift schedules, and synchronized team calendars.",
          features: ["Multi-location holiday schedules", "Rotational night/day shifts", "Google & Outlook calendar sync"],
          tags: ["Shift Rosters", "Multi-Branch", "Calendar Sync"],
          statVal: "24/7",
          statLbl: "Shift Coverage",
          pexelsQuery: "Calendar schedule shift planning digital schedule tablet executive office",
          icon: "fa-calendar-days"
        },
        {
          id: "payroll-salary",
          num: "08",
          title: "Salary Slip / Payroll",
          badge: "1-Click Payroll",
          description: "Automated gross-to-net calculation with statutory PF, ESI, PT, TDS deductions, and password-protected PDF salary slips.",
          features: ["1-Click automated payroll runs", "Statutory PF, ESI, PT & TDS", "Encrypted digital salary slips"],
          tags: ["1-Click Run", "PF & ESI Direct", "Form 16 Sync"],
          statVal: "100%",
          statLbl: "Statutory Compliance",
          pexelsQuery: "Salary Slip Payroll accounting tax financial report spreadsheet laptop",
          icon: "fa-file-invoice-dollar"
        },
        {
          id: "analytics-reports",
          num: "09",
          title: "Analytics & Reports",
          badge: "BI Intelligence",
          description: "Attrition analytics, attendance heatmaps, overtime expenditure forecasting, and one-click statutory compliance export.",
          features: ["Headcount & cost BI charts", "Overtime expenditure heatmap", "PF ECR & state labor reports"],
          tags: ["Executive BI", "Cost Control", "Audit Ready"],
          statVal: "40+ Reports",
          statLbl: "Instant Exports",
          pexelsQuery: "Analytics & Reports business intelligence charts graphs data presentation",
          icon: "fa-chart-pie"
        }
      ];
      renderModules(fallbackModules);
    }
  }

  // Render modules into large sticky stacking cards with GSAP scroll animation
  function renderModules(modules) {
    if (!moduleWrapper) return;
    moduleWrapper.innerHTML = "";

    modules.forEach((mod, index) => {
      const cardEl = document.createElement("div");
      cardEl.className = "module-stack-card";
      cardEl.setAttribute("data-module-id", mod.id);
      cardEl.style.zIndex = index + 1;

      const featuresHtml = (mod.features || [])
        .map(f => `<div class="msc-feat-item"><i class="fa-solid fa-circle-check"></i> <span>${f}</span></div>`)
        .join("");

      cardEl.innerHTML = `
        <!-- Full-bleed background image -->
        <div class="msc-bg-wrap">
          <img data-pexels-query="${mod.pexelsQuery}" data-target="landscape" data-pexels-orientation="landscape" alt="${mod.title}" class="msc-bg-img" />
          <div class="msc-bg-gradient"></div>
        </div>

        <!-- Large Top-Right Number -->
        <div class="msc-num">${mod.num}</div>

        <!-- Foreground Content (Left Column) -->
        <div class="msc-content-wrap">
          <div class="msc-header">
            <div class="msc-meta">
              <span class="msc-badge">${mod.badge || 'Enterprise Suite'}</span>
            </div>
          </div>

          <h3 class="msc-title">${mod.title}</h3>
          <p class="msc-summary">${mod.summary}</p>
          <p class="msc-description">${mod.description}</p>

          <div class="msc-footer">
            <div class="msc-metric-box">
              <span class="msc-metric-val">${mod.statVal || '100%'}</span>
              <span class="msc-metric-lbl">${mod.statLbl || 'Statutory Metric'}</span>
            </div>
          </div>
        </div>

        <!-- Floating White Feature Grid (Right Bottom) -->
        <div class="msc-feat-grid">
          <div class="msc-feat-grid-title">Key Capabilities</div>
          ${featuresHtml}
        </div>
      `;

      moduleWrapper.appendChild(cardEl);

      // Trigger Pexels dynamic image if available
      const imgEl = cardEl.querySelector("img[data-pexels-query]");
      if (imgEl && window.PexelsAPI && window.PexelsAPI.applyImageToElement) {
        window.PexelsAPI.applyImageToElement(imgEl, mod.pexelsQuery, "large", "landscape");
      }
    });

    // Initialize GSAP Sticky Stacking Scroll Animation
    initModulesStackAnimation();
  }

  // GSAP Sticky Stacking Cards Scroll Animation (High Performance: No blur filter, max 1 card behind)
  function initModulesStackAnimation() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray(".module-stack-card");
    if (!cards.length) return;

    cards.forEach((card, i) => {
      // Smooth GPU-accelerated scaling and opacity transition (NO heavy blur filter)
      if (i < cards.length - 1) {
        gsap.to(card, {
          scale: 0.95,
          y: -12,
          opacity: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          }
        });
      }

      // Hide older cards when 2 cards ahead arrive so only 1 card remains behind in the stack
      if (i < cards.length - 2) {
        gsap.to(card, {
          opacity: 0,
          pointerEvents: "none",
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 2],
            start: "top 85%",
            end: "top 40%",
            scrub: true,
          }
        });
      }
    });
  }

  // Open Details Modal using pre-made .cs-modal classes
  function openModuleModal(mod) {
    if (!bsModal) return;

    const titleEl = document.getElementById("hrmsModalTitle");
    const badgeEl = document.getElementById("hrmsModalBadge");
    const numEl = document.getElementById("hrmsModalNum");
    const imgEl = document.getElementById("hrmsModalImg");
    const statValEl = document.getElementById("hrmsModalStatVal");
    const statLblEl = document.getElementById("hrmsModalStatLbl");
    const descEl = document.getElementById("hrmsModalDesc");
    const featuresEl = document.getElementById("hrmsModalFeatures");

    if (titleEl) titleEl.textContent = mod.title;
    if (badgeEl) badgeEl.textContent = mod.badge || "Module " + mod.num;
    if (numEl) numEl.textContent = "#" + mod.num;
    if (statValEl) statValEl.textContent = mod.statVal || "100%";
    if (statLblEl) statLblEl.textContent = mod.statLbl || "Reliability";
    if (descEl) descEl.textContent = mod.description || mod.summary;

    if (featuresEl) {
      featuresEl.innerHTML = "";
      (mod.features || []).forEach((feat) => {
        const li = document.createElement("li");
        li.className = "mb-2 d-flex align-items-center gap-2";
        li.innerHTML = `<i class="fa-solid fa-circle-check text-primary"></i> <span>${feat}</span>`;
        featuresEl.appendChild(li);
      });
    }

    if (imgEl && mod.pexelsQuery && window.PexelsAPI && window.PexelsAPI.applyImageToElement) {
      window.PexelsAPI.applyImageToElement(imgEl, mod.pexelsQuery, "large");
    }

    bsModal.show();
  }

  // Case Study Modal Handlers
  const caseStudyButtons = document.querySelectorAll(".btn-csc-modal");
  const caseStudiesData = {
    retail: {
      title: "Eliminated Buddy Punching Across 65 Retail Showrooms Nationwide",
      badge: "Enterprise Retail (1,200+ Staff)",
      statVal1: "99.8%",
      statLbl1: "Attendance Veracity",
      statVal2: "0%",
      statLbl2: "Proxy Clock-Ins",
      overview: "A prominent lifestyle retail brand with 65 flagship stores across 18 tier-1 and tier-2 cities struggled with untracked split shifts, buddy punch disputes, and manual paper attendance registers.",
      solution: "Deployed AdoTeam with mobile GPS geo-fenced clock-in (50m store radius perimeter) synchronized with biometric cloud terminals and real-time shift alerts.",
      impact: "Reduced monthly attendance regularization disputes by 94%, saved 45 admin hours per store, and guaranteed 100% on-time payroll delivery.",
      pexelsQuery: "retail luxury store employees modern showroom team"
    },
    fintech: {
      title: "Automated Multi-State Statutory Payroll for 850 High-Growth Employees",
      badge: "FinTech Enterprise",
      statVal1: "3.5 Hrs",
      statLbl1: "Payroll Cycle (Was 5 Days)",
      statVal2: "100%",
      statLbl2: "Statutory Compliance",
      overview: "Operating across 6 Indian states, the client faced complex state-specific Professional Tax (PT) slabs, fluctuating variable sales incentives, and monthly PF/ESI submission delays.",
      solution: "Integrated Adomantra Automated Statutory Payroll engine with customized multi-state tax rules, direct bank disbursement file exports, and password-protected encrypted digital salary slips.",
      impact: "Reduced payroll processing time from 5 business days to 3.5 hours with zero tax calculation discrepancy.",
      pexelsQuery: "fintech accounting professional laptop financial spreadsheet office"
    },
    logistics: {
      title: "Real-Time Location Attendance for 2,400+ On-Field Delivery Executives",
      badge: "Supply Chain & Logistics",
      statVal1: "2,400+",
      statLbl1: "Field Drivers Tracked",
      statVal2: "1-Click",
      statLbl2: "Client Site Regularization",
      overview: "A nationwide logistics and last-mile delivery fleet needed an automated way to verify attendance at multiple hub locations, customer depots, and transit routes without physical hardware.",
      solution: "Implemented Adomantra Mobile Geo-Attendance with dynamic polygon geo-fencing, offline punch caching with cryptographic timestamp validation, and automated distance allowance calculations.",
      impact: "Eliminated fraudulent travel allowance claims by 38% and boosted verified field delivery on-time arrival to 98.4%.",
      pexelsQuery: "logistics warehouse transport driver delivery modern facility tablet"
    }
  };

  caseStudyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const caseKey = btn.getAttribute("data-case") || "retail";
      const cs = caseStudiesData[caseKey];
      if (!cs || !bsModal) return;

      const titleEl = document.getElementById("hrmsModalTitle");
      const badgeEl = document.getElementById("hrmsModalBadge");
      const numEl = document.getElementById("hrmsModalNum");
      const imgEl = document.getElementById("hrmsModalImg");
      const statValEl = document.getElementById("hrmsModalStatVal");
      const statLblEl = document.getElementById("hrmsModalStatLbl");
      const descEl = document.getElementById("hrmsModalDesc");
      const featuresEl = document.getElementById("hrmsModalFeatures");

      if (titleEl) titleEl.textContent = cs.title;
      if (badgeEl) badgeEl.textContent = cs.badge;
      if (numEl) numEl.textContent = "CASE";
      if (statValEl) statValEl.textContent = cs.statVal1;
      if (statLblEl) statLblEl.textContent = cs.statLbl1;
      if (descEl) descEl.textContent = cs.overview;

      if (featuresEl) {
        featuresEl.innerHTML = `
          <li class="mb-2 d-flex align-items-start gap-2">
            <i class="fa-solid fa-circle-check text-primary mt-1"></i>
            <div><strong>Solution:</strong> ${cs.solution}</div>
          </li>
          <li class="mb-2 d-flex align-items-start gap-2">
            <i class="fa-solid fa-chart-line text-primary mt-1"></i>
            <div><strong>Impact:</strong> ${cs.impact}</div>
          </li>
        `;
      }

      if (imgEl && cs.pexelsQuery && window.PexelsAPI && window.PexelsAPI.applyImageToElement) {
        window.PexelsAPI.applyImageToElement(imgEl, cs.pexelsQuery, "large");
      }

      bsModal.show();
    });
  });

  // =======================================================
  // WORKFORCE PERFORMANCE BENCHMARKS (PREMIUM MOCKUP ENGINE)
  // =======================================================
  const benchmarksData = [
    {
      id: "velocity",
      metric: "4.8x",
      title: "Approval Velocity",
      badge: "4.8x Faster",
      headline: "Approval Latency: Other Solutions vs Adomantra",
      legendOther: "Other (48 hrs avg)",
      legendUs: "Adomantra (10 hrs avg)",
      labels: ["Leave Request", "Missed Punch", "Overtime", "Comp-Off", "Shift Swap"],
      otherData: [48, 36, 28, 52, 34],
      usData: [10, 8, 6, 11, 7],
      yUnit: " hrs",
      otherStrip: {
        val: "48 Hours Delay",
        pill: "Manual Email Chains",
        pillClass: "status-action"
      },
      usStrip: {
        val: "10 Hours (4.8x Faster)",
        pill: "Instant Push Approvals",
        pillClass: "status-signed"
      }
    },
    {
      id: "geoprecision",
      metric: "99.8%",
      title: "Geo-Precision",
      badge: "99.8% Precision",
      headline: "On-Premise Verification Rate: Hardware Register vs GPS Geofence",
      legendOther: "Other (68% verified)",
      legendUs: "Adomantra (99.8% verified)",
      labels: ["Retail Store", "Corporate HQ", "Project Site", "Warehouse Hub", "Field Logistics"],
      otherData: [68, 74, 58, 65, 54],
      usData: [99.8, 99.9, 99.6, 99.8, 99.7],
      yUnit: "%",
      otherStrip: {
        val: "32% Buddy Punching Leakage",
        pill: "Unverified Check-Ins",
        pillClass: "status-action"
      },
      usStrip: {
        val: "99.8% Geo-Perimeter Lock",
        pill: "Anti-Spoofing Polygon",
        pillClass: "status-signed"
      }
    },
    {
      id: "compliance",
      metric: "100%",
      title: "Statutory Compliance",
      badge: "100% Compliant",
      headline: "Statutory Accuracy & On-Time Filing Compliance",
      legendOther: "Other (78% accuracy)",
      legendUs: "Adomantra (100% verified)",
      labels: ["PF ECR Filing", "ESI Calculation", "Professional Tax", "TDS Slabs", "Labor Welfare"],
      otherData: [78, 82, 74, 80, 76],
      usData: [100, 100, 100, 100, 100],
      yUnit: "%",
      otherStrip: {
        val: "22% Calculation Error Risk",
        pill: "Manual Excel Risk",
        pillClass: "status-action"
      },
      usStrip: {
        val: "100% Zero-Defect Filing",
        pill: "Auto ECR & Challans",
        pillClass: "status-signed"
      }
    },
    {
      id: "adoption",
      metric: "50k+",
      title: "Daily Mobile Clock-Ins",
      badge: "50k+ Daily Concurrency",
      headline: "Morning Peak Punch Speed: Turnstile Line vs Mobile 1-Tap",
      legendOther: "Other (45s queue)",
      legendUs: "Adomantra (1.2s tap)",
      labels: ["08:30 AM", "09:00 AM", "09:15 AM", "09:30 AM", "10:00 AM"],
      otherData: [42, 65, 75, 58, 36],
      usData: [1.2, 1.2, 1.3, 1.2, 1.1],
      yUnit: "s",
      otherStrip: {
        val: "15 Min Lobby Turnstile Queues",
        pill: "Congestion & Delays",
        pillClass: "status-action"
      },
      usStrip: {
        val: "1.2 Second 1-Tap Check-In",
        pill: "Zero Turnstile Wait",
        pillClass: "status-signed"
      }
    },
    {
      id: "timesaved",
      metric: "60%",
      title: "HR Admin Time Saved",
      badge: "60% Time Reclaimed",
      headline: "Monthly HR Operational Hours: Manual Excel vs Automated Pipeline",
      legendOther: "Other (130 hrs/mo)",
      legendUs: "Adomantra (40 hrs/mo)",
      labels: ["Payroll Processing", "Leave Audit", "Punch Correction", "Slip Dispatch", "Tax Proofs"],
      otherData: [40, 24, 18, 16, 32],
      usData: [16, 8, 4, 2, 10],
      yUnit: " hrs",
      otherStrip: {
        val: "130 Hours Monthly Grind",
        pill: "5-7 Days Payroll Cycle",
        pillClass: "status-action"
      },
      usStrip: {
        val: "40 Hours (60% Reclaimed)",
        pill: "3.5 Hour Payroll Run",
        pillClass: "status-signed"
      }
    }
  ];

  let chartInstance = null;
  let benchmarkSwiper = null;

  function initBenchmarks() {
    const tabsContainer = document.getElementById("benchmarkTabs");
    if (!tabsContainer) return;

    tabsContainer.innerHTML = "";

    benchmarksData.forEach((item, index) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      slide.innerHTML = `
        <div class="clean-tab-item benchmark-card-item ${index === 0 ? "is-active" : ""}" data-index="${index}">
          <div class="cti-main">
            <span class="cti-metric">${item.metric}</span>
            <span class="cti-title">${item.title}</span>
          </div>
          <div class="cti-arrow-wrap">
            <i class="fa-solid fa-arrow-right cti-arrow"></i>
          </div>
        </div>
      `;

      slide.querySelector(".clean-tab-item").addEventListener("click", () => {
        if (benchmarkSwiper) {
          benchmarkSwiper.slideToLoop(index);
        } else {
          switchBenchmark(index);
        }
      });

      tabsContainer.appendChild(slide);
    });

    // Initialize Swiper with auto-changing cards (no nav/pagination)
    if (typeof Swiper !== "undefined") {
      benchmarkSwiper = new Swiper(".benchmark-swiper", {
        direction: "vertical",
        slidesPerView: 3,
        spaceBetween: 14,
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        speed: 600,
        breakpoints: {
          0: {
            direction: "horizontal",
            slidesPerView: 1.2,
            spaceBetween: 12
          },
          640: {
            direction: "horizontal",
            slidesPerView: 2.2,
            spaceBetween: 14
          },
          1024: {
            direction: "vertical",
            slidesPerView: 3,
            spaceBetween: 14
          }
        },
        on: {
          slideChange: function () {
            const activeIndex = this.realIndex;
            switchBenchmark(activeIndex);
          }
        }
      });
    }

    // Initial render
    switchBenchmark(0);
  }

  function switchBenchmark(index) {
    const data = benchmarksData[index];
    if (!data) return;

    // Update active tab styles on left
    const allTabs = document.querySelectorAll(".clean-tab-item");
    allTabs.forEach((tab) => {
      const tabIdx = parseInt(tab.getAttribute("data-index"), 10);
      if (tabIdx === index) {
        tab.classList.add("is-active");
      } else {
        tab.classList.remove("is-active");
      }
    });

    // Update graph meta headline and legends
    const badgeEl = document.getElementById("graphBadge");
    const headlineEl = document.getElementById("graphHeadline");
    const legendOther = document.querySelector(".legend-other");
    const legendUs = document.querySelector(".legend-us");

    if (badgeEl) badgeEl.textContent = data.badge;
    if (headlineEl) headlineEl.textContent = data.headline;
    if (legendOther) {
      legendOther.innerHTML = `<span class="legend-dot dot-other"></span> ${data.legendOther}`;
    }
    if (legendUs) {
      legendUs.innerHTML = `<span class="legend-dot dot-us"></span> ${data.legendUs}`;
    }

    // Render minimal, smooth animated Chart.js with primary color
    renderMinimalistChart(data);
  }

  function renderMinimalistChart(data) {
    const canvas = document.getElementById("benchmarkChart");
    if (!canvas || typeof Chart === "undefined") return;

    // Smooth update of existing chart instance without destroying canvas (super smooth 60fps)
    if (chartInstance) {
      chartInstance.data.labels = data.labels;
      chartInstance.data.datasets[0].data = data.otherData;
      chartInstance.data.datasets[1].data = data.usData;
      chartInstance.options.scales.y.ticks.callback = function (val) {
        return val + (data.yUnit || "");
      };
      chartInstance.options.plugins.tooltip.callbacks.label = function (context) {
        return ` ${context.dataset.label}: ${context.parsed.y}${data.yUnit || ""}`;
      };
      chartInstance.update();
      return;
    }

    const ctx = canvas.getContext("2d");

    // First time initialization
    const gradientUs = ctx.createLinearGradient(0, 0, 0, 280);
    gradientUs.addColorStop(0, "rgba(18, 87, 162, 0.25)");
    gradientUs.addColorStop(0.6, "rgba(18, 87, 162, 0.06)");
    gradientUs.addColorStop(1, "rgba(18, 87, 162, 0.00)");

    const gradientOther = ctx.createLinearGradient(0, 0, 0, 280);
    gradientOther.addColorStop(0, "rgba(239, 68, 68, 0.15)");
    gradientOther.addColorStop(0.6, "rgba(239, 68, 68, 0.03)");
    gradientOther.addColorStop(1, "rgba(239, 68, 68, 0.00)");

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Other Solutions",
            data: data.otherData,
            borderColor: "#EF4444",
            backgroundColor: gradientOther,
            borderWidth: 2.2,
            pointBackgroundColor: "#EF4444",
            pointBorderColor: "#FFFFFF",
            pointBorderWidth: 2,
            pointRadius: 4.5,
            pointHoverRadius: 7,
            tension: 0.38,
            fill: true
          },
          {
            label: "AdoTeam",
            data: data.usData,
            borderColor: "#1257A2",
            backgroundColor: gradientUs,
            borderWidth: 3,
            pointBackgroundColor: "#1257A2",
            pointBorderColor: "#FFFFFF",
            pointBorderWidth: 2.5,
            pointRadius: 5.5,
            pointHoverRadius: 8,
            tension: 0.38,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 24,
            bottom: 6,
            left: 4,
            right: 12
          }
        },
        animation: {
          duration: 600,
          easing: "easeOutCubic"
        },
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "#0F172A",
            titleFont: { family: "'Google Sans', sans-serif", size: 12, weight: "bold" },
            bodyFont: { family: "'Google Sans Text', sans-serif", size: 11 },
            padding: 10,
            cornerRadius: 8,
            usePointStyle: true,
            boxPadding: 4,
            callbacks: {
              label: function (context) {
                return ` ${context.dataset.label}: ${context.parsed.y}${data.yUnit || ""}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              minRotation: 45,
              maxRotation: 45,
              color: "#9CA3AF",
              font: { family: "'Google Sans Text', sans-serif", size: 10, weight: "500" }
            }
          },
          y: {
            beginAtZero: true,
            grace: "15%",
            grid: {
              color: "#F3F4F6",
              drawBorder: false
            },
            ticks: {
              color: "#9CA3AF",
              font: { family: "'Google Sans Text', sans-serif", size: 10 },
              callback: function (val) {
                return val + (data.yUnit || "");
              }
            }
          }
        }
      }
    });
  }

  // ============================================================
  // 3 FEATURE SHOWCASE BANNERS (JSON CONST & DYNAMIC INNERHTML)
  // Left/Right alternating layouts, 3 images/cards per banner, 
  // bullet checkmarks, and CTA buttons matching Multiplier design.
  // ============================================================
  const showcaseBannersData = [
    {
      id: "banner-payroll",
      layout: "image-left", // Left: Media & Floating Badges, Right: Copy
      tagline: "Payroll & Statutory Compliance",
      headline: "Simple, accurate payroll your team can count on",
      description: "Automate month-end payroll without the spreadsheets or calculation headaches. AdoTeam connects attendance, leave, and tax rules to deliver on-time, compliant salary disbursements every single cycle.",
      bulletPoints: [
        "1-Click payroll calculation linked directly to attendance & leaves",
        "Automated PF, ESI, PT & TDS statutory tax deductions",
        "Password-protected digital salary slips delivered straight to employees"
      ],
      ctaText: "Book a Demo",
      ctaLink: "#heroContactForm",
      primaryImage: {
        query: "financial payroll dashboard charts on laptop screen modern workspace desk",
        alt: "Payroll & Statutory Compliance Dashboard",
        fallback: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
      },
      floatingCards: [
        {
          type: "payroll-table",
          position: "bottom-left",
          title: "Monthly Disbursement",
          badge: "Verified",
          rows: [
            { flag: "🇮🇳", country: "Operations & Tech", prefix: "₹", rawVal: 1842000, decimals: 2, amount: "₹18,42,000.00", avatars: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face"] },
            { flag: "🇮🇳", country: "Sales & Field Staff", prefix: "₹", rawVal: 1264500, decimals: 2, amount: "₹12,64,500.00", avatars: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face"] },
            { flag: "🇮🇳", country: "Corporate & Admin", prefix: "₹", rawVal: 685200, decimals: 2, amount: "₹6,85,200.00", avatars: ["https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&crop=face", "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop&crop=face", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&h=60&fit=crop&crop=face"] }
          ]
        },
        {
          type: "stat-chip",
          position: "top-right",
          lucideIcon: "shield-check",
          title: "100% Compliant"
        }
      ]
    },
    {
      id: "banner-unified-platform",
      layout: "image-right", // Left: Copy, Right: Media & Stepper UI
      tagline: "Everything In One Place",
      headline: "One simple place for attendance, leave & payroll",
      description: "Stop jumping between messy spreadsheets and disconnected tools. AdoTeam brings your daily attendance, leave approvals, employee records, and payroll into one easy system your staff will actually enjoy using.",
      bulletPoints: [
        "Attendance and leave data flow straight into payroll automatically",
        "Clear self-service access for staff to request time-off & check slips",
        "Built-in compliance checks for PF, ESI, and tax deductions with zero fuss"
      ],
      ctaText: "See How It Works",
      ctaLink: "#heroContactForm",
      primaryImage: {
        query: "laptop screen showing modern software application analytics desk workspace",
        alt: "Unified HRMS Dashboard on Laptop",
        fallback: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
      },
      floatingCards: [
        {
          type: "workflow-stepper",
          position: "top-left",
          steps: [
            { icon: "fa-solid fa-user-check", title: "Employee Onboarded", sub: "Digital KYC Verified", active: true, color: "#1257A2" },
            { icon: "fa-solid fa-calculator", title: "Automated Payroll", sub: "Gross-to-Net Computed", active: true, color: "#3B82F6" },
            { icon: "fa-solid fa-coins", title: "Statutory Disbursal", sub: "Bank & Tax API Synced", active: true, color: "#06B6D4" }
          ]
        },
        {
          type: "currency-list",
          position: "bottom-right",
          title: "Department Payroll",
          items: [
            { lucideIcon: "briefcase", label: "Engineering & Tech", prefix: "₹", rawVal: 1850000, decimals: 0, value: "₹18,50,000", progress: 95 },
            { lucideIcon: "trending-up", label: "Sales & Field Ops", prefix: "₹", rawVal: 1240000, decimals: 0, value: "₹12,40,000", progress: 85 },
            { lucideIcon: "target", label: "Marketing & Growth", prefix: "₹", rawVal: 820000, decimals: 0, value: "₹8,20,000", progress: 75 },
            { lucideIcon: "building-2", label: "HR & Operations", prefix: "₹", rawVal: 540000, decimals: 0, value: "₹5,40,000", progress: 90 }
          ]
        }
      ]
    },
    {
      id: "banner-geo-attendance",
      layout: "image-left", // Left: Media & Anti-Spoofing UI, Right: Copy
      tagline: "Smart Mobile Attendance",
      headline: "Anti-Spoofing Geo-Fencing & Biometric Sync",
      description: "Empower your field force, hybrid employees, and branch offices with tamper-proof mobile clock-ins. Set precise virtual GPS boundaries from 10m to 500m with AI facial liveness detection and instant cloud biometric synchronization.",
      bulletPoints: [
        "99.8% precision GPS perimeter with zero buddy punching",
        "Instant synchronization with ZKTeco, eSSL & biometric hardware",
        "Offline punch caching with automatic background retry sync"
      ],
      ctaText: "Schedule Attendance Demo",
      ctaLink: "#heroContactForm",
      primaryImage: {
        query: "hand holding smartphone with map location gps tracking technology",
        alt: "Mobile Geo-Punch Attendance App",
        fallback: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80"
      },
      floatingCards: [
        {
          type: "geo-tracker",
          position: "bottom-left",
          title: "Live Geo-Fence Status",
          badge: "Active Radar",
          perimeter: "Office Perimeter: 50m Radius",
          coords: "28.6139° N, 77.2090° E",
          status: "Verified On-Premise"
        },
        {
          type: "stat-chip",
          position: "top-right",
          lucideIcon: "crosshair",
          title: "99.8% Accuracy"
        }
      ]
    }
  ];

  function renderShowcaseBanners() {
    const container = document.getElementById("showcaseBannersContainer");
    if (!container) return;

    let html = "";

    showcaseBannersData.forEach((banner, index) => {
      const isImageLeft = banner.layout === "image-left";
      
      // Floating Card 1 HTML
      let card1Html = "";
      if (banner.floatingCards && banner.floatingCards[0]) {
        const fc = banner.floatingCards[0];
        if (fc.type === "payroll-table") {
          card1Html = `
            <div class="sbc-card sbc-card-table sbc-pos-${fc.position}">
              <div class="sbc-card-hdr">
                <span class="sbc-card-title">${fc.title}</span>
                <span class="sbc-chip-mini">${fc.badge}</span>
              </div>
              <div class="sbc-table-body">
                ${fc.rows.map(r => `
                  <div class="sbc-table-row">
                    <div class="sbc-tr-left">
                      <span class="sbc-flag">${r.flag}</span>
                      <div class="sbc-avatar-group">
                        ${r.avatars.map(av => `<img src="${av}" alt="Employee" class="sbc-avatar" loading="lazy" />`).join("")}
                      </div>
                    </div>
                    <div class="sbc-tr-right">
                      <span class="sbc-amount sbc-odometer" data-target="${r.rawVal}" data-prefix="${r.prefix || ''}" data-decimals="${r.decimals || 0}">${r.amount}</span>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `;
        } else if (fc.type === "workflow-stepper") {
          card1Html = `
            <div class="sbc-card sbc-card-stepper sbc-pos-${fc.position}">
              <div class="sbc-stepper-list">
                ${fc.steps.map(st => `
                  <div class="sbc-step-item">
                    <div class="sbc-step-icon" style="background: ${st.color}">
                      <i class="${st.icon}"></i>
                    </div>
                    <div class="sbc-step-text">
                      <span class="sbc-step-title">${st.title}</span>
                      <span class="sbc-step-sub">${st.sub}</span>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `;
        } else if (fc.type === "geo-tracker") {
          card1Html = `
            <div class="sbc-card sbc-card-geo sbc-pos-${fc.position}">
              <div class="sbc-card-hdr">
                <div class="d-flex align-items-center gap-2">
                  <span class="sbc-pulse-dot"></span>
                  <span class="sbc-card-title">${fc.title}</span>
                </div>
                <span class="sbc-chip-mini bg-emerald">${fc.badge}</span>
              </div>
              <div class="sbc-geo-body">
                <div class="sbc-geo-info">
                  <i class="fa-solid fa-map-pin text-primary"></i>
                  <span>${fc.perimeter}</span>
                </div>
                <div class="sbc-geo-status">
                  <i class="fa-solid fa-circle-check text-emerald"></i>
                  <span>${fc.status}</span>
                </div>
              </div>
            </div>
          `;
        }
      }

      // Floating Card 2 HTML
      let card2Html = "";
      if (banner.floatingCards && banner.floatingCards[1]) {
        const fc2 = banner.floatingCards[1];
        if (fc2.type === "currency-list") {
          card2Html = `
            <div class="sbc-card sbc-card-currency sbc-pos-${fc2.position}">
              <div class="sbc-card-hdr mb-2">
                <span class="sbc-card-title">${fc2.title}</span>
              </div>
              <div class="sbc-currency-body">
                ${fc2.items.map(it => `
                  <div class="sbc-curr-row">
                    <div class="sbc-curr-left">
                      <span class="sbc-flag sbc-icon-wrap">${it.lucideIcon ? `<i data-lucide="${it.lucideIcon}"></i>` : (it.flag || '')}</span>
                      <div class="sbc-curr-bar-wrap">
                        <div class="sbc-curr-bar" style="width: ${it.progress}%"></div>
                      </div>
                    </div>
                    <span class="sbc-curr-val sbc-odometer" data-target="${it.rawVal}" data-prefix="${it.prefix || ''}" data-decimals="${it.decimals || 0}">${it.value}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          `;
        } else if (fc2.type === "stat-chip") {
          card2Html = `
            <div class="sbc-card sbc-card-chip sbc-pos-${fc2.position}">
              <div class="sbc-chip-icon-circle">
                <i data-lucide="${fc2.lucideIcon || 'check'}"></i>
              </div>
              <div>
                <div class="sbc-chip-title">${fc2.title}</div>
                ${fc2.sub ? `<div class="sbc-chip-sub">${fc2.sub}</div>` : ""}
              </div>
            </div>
          `;
        }
      }

      // Visual Media Column
      const mediaColumn = `
        <div class="showcase-banner-media-col">
          <div class="showcase-banner-media-wrap">
            <div class="sbc-main-img-frame">
              <img 
                data-pexels-query="${banner.primaryImage.query}" 
                data-pexels-quality="large"
                src="${banner.primaryImage.fallback}" 
                alt="${banner.primaryImage.alt}" 
                class="sbc-main-img" 
                loading="lazy" 
              />
            </div>
            ${card1Html}
            ${card2Html}
          </div>
        </div>
      `;

      // Copy Column
      const copyColumn = `
        <div class="showcase-banner-copy-col">
          <h2>${banner.headline}</h2>
          <p>${banner.description}</p>
          <ul class="sbc-points-list">
            ${banner.bulletPoints.map(point => `
              <li class="sbc-point-item">
                <span class="sbc-point-icon"><i class="fa-solid fa-circle-check"></i></span>
                <span class="sbc-point-text">${point}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      `;

      // Combine row based on layout (image-left vs image-right)
      html += `
        <div class="showcase-banner-item ${banner.layout}" id="${banner.id}">
          <div class="showcase-banner-grid ${isImageLeft ? 'grid-img-left' : 'grid-img-right'}">
            ${isImageLeft ? mediaColumn + copyColumn : copyColumn + mediaColumn}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Initialize Lucide icons
    if (typeof lucide !== "undefined" && typeof lucide.createIcons === "function") {
      lucide.createIcons();
    }

    // Initialize Odometer Counter for numbers
    initShowcaseOdometers();

    // Apply Pexels dynamic photos progressive loader
    if (window.PexelsAPI && typeof window.PexelsAPI.applyImageToElement === "function") {
      container.querySelectorAll("img[data-pexels-query]").forEach(img => {
        const query = img.getAttribute("data-pexels-query");
        if (query) {
          window.PexelsAPI.applyImageToElement(img, query, "large");
        }
      });
    }
  }

  function initShowcaseOdometers() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    document.querySelectorAll(".showcase-banner-item").forEach((item) => {
      let animated = false;
      ScrollTrigger.create({
        trigger: item,
        start: "top 80%",
        onEnter: () => {
          if (animated) return;
          animated = true;

          item.querySelectorAll(".sbc-odometer").forEach((counter) => {
            const target = parseFloat(counter.getAttribute("data-target")) || 0;
            const prefix = counter.getAttribute("data-prefix") || "";
            const decimals = parseInt(counter.getAttribute("data-decimals"), 10) || 0;
            const obj = { val: 0 };

            gsap.to(obj, {
              val: target,
              duration: 2.2,
              ease: "power3.out",
              onUpdate: () => {
                let formatted;
                if (decimals > 0) {
                  formatted = obj.val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
                } else {
                  formatted = Math.round(obj.val).toLocaleString('en-US');
                }
                counter.textContent = prefix + formatted;
              }
            });
          });
        }
      });
    });
  }

  // ============ PUT YOUR HR ON AUTOPILOT - GSAP SCROLLTRIGGER (FIXED) ============
  function initLeaveScreenshotScroll() {
    const section = document.querySelector("#leave-autopilot");
    if (!section) return;

    const snippets = Array.from(section.querySelectorAll(".leave-scroll-snippet"));
    const uiCards  = Array.from(section.querySelectorAll(".leave-ui-stack-card"));
    if (!snippets.length || !uiCards.length) return;

    function activateStep(stepNum) {
      const s = String(stepNum);

      snippets.forEach((snip) => {
        if (window.innerWidth < 576) {
          snip.style.opacity = "1";
          snip.style.transform = "none";
        } else if (snip.getAttribute("data-step") === s) {
          snip.style.opacity   = "1";
          snip.style.transform = "translateY(0)";
        } else {
          snip.style.opacity   = "0.32";
          snip.style.transform = "translateY(6px)";
        }
      });

      uiCards.forEach((card) => {
        if (card.getAttribute("data-step") === s) {
          card.classList.add("is-active");
        } else {
          card.classList.remove("is-active");
        }
      });
    }

    // Activate step 1 immediately
    activateStep(1);

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    // Register plugin just in case
    gsap.registerPlugin(ScrollTrigger);

    // Kill any old triggers in this section to avoid duplicates on re-init
    ScrollTrigger.getAll().forEach((t) => {
      if (t.vars && t.vars._leaveSection) t.kill();
    });

    snippets.forEach((snippet) => {
      const step = snippet.getAttribute("data-step");
      const isMobile = window.innerWidth < 576;

      ScrollTrigger.create({
        _leaveSection: true,          // tag so we can kill them above
        trigger:   snippet,
        start:     isMobile ? "top 80%" : "top 65%",   // card activates when snippet top enters trigger area
        end:       isMobile ? "bottom 45%" : "bottom 35%",
        onEnter:     () => activateStep(step),
        onEnterBack: () => activateStep(step),
      });
    });

    // Force a layout recalculation after fonts / images load
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  // =======================================================
  // DYNAMIC CLIENT LOGOS HYDRATION (ULTRA-FAST FROM JSON)
  // =======================================================
  const defaultClientsList = [
    { name: "Narayana", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-4.webp" },
    { name: "Saroj Hospital", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-5.webp" },
    { name: "Kaya Clinic", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-6.webp" },
    { name: "MediBuddy", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-7.webp" },
    { name: "Microsoft", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-8.webp" },
    { name: "Hilton", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-9.webp" },
    { name: "Chevrolet", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-10.webp" },
    { name: "Garnier", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-11.webp" },
    { name: "Ola", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-12.webp" },
    { name: "Punjab National Bank", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-13.webp" },
    { name: "GroupM", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-14.webp" },
    { name: "Isobar", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-16.webp" },
    { name: "Madhouse", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-17.webp" },
    { name: "Resultrix", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-18.webp" },
    { name: "Havas Media", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-19.webp" },
    { name: "Philips", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-20.webp" },
    { name: "Snickers", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-21.webp" },
    { name: "Honda", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-22.webp" },
    { name: "Emirates", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-23.webp" },
    { name: "Asian Paints", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-24.webp" },
    { name: "Client Partner", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-25.webp" },
    { name: "Big Trunk", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-26.webp" },
    { name: "Inox", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-27.webp" },
    { name: "Maxcure Hospital", image: "https://www.adomantra.com/public/ourcustomer/ourcustomer-28.webp" }
  ];

  function renderClients(clients) {
    const gridContainer = document.getElementById("clientsGridContainer");
    const swiper1 = document.getElementById("clientsSwiperRow1");
    const swiper2 = document.getElementById("clientsSwiperRow2");

    if (gridContainer) {
      gridContainer.innerHTML = clients
        .map(
          (c) => `
        <div class="col-6 col-md-4 col-lg-2 border-line">
          <img src="${c.image}" title="${c.name || 'Client'}" alt="${c.name || 'Client'}" loading="lazy" width="100%" height="100%">
        </div>`
        )
        .join("");
    }

    if (swiper1 && swiper2) {
      const half = Math.ceil(clients.length / 2);
      const row1 = clients.slice(0, half);
      const row2 = clients.slice(half);

      swiper1.innerHTML = row1
        .map(
          (c) => `
        <div class="swiper-slide">
          <div class="border-line">
            <img src="${c.image}" title="${c.name || 'Client'}" alt="${c.name || 'Client'}" loading="lazy">
          </div>
        </div>`
        )
        .join("");

      swiper2.innerHTML = row2
        .map(
          (c) => `
        <div class="swiper-slide">
          <div class="border-line">
            <img src="${c.image}" title="${c.name || 'Client'}" alt="${c.name || 'Client'}" loading="lazy">
          </div>
        </div>`
        )
        .join("");
    }
  }

  async function loadClientsData() {
    try {
      const res = await fetch("data/clients.json");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      renderClients(Array.isArray(data) ? data : (data.clients || defaultClientsList));
    } catch (e) {
      renderClients(defaultClientsList);
    }
  }

  // GSAP Sticky Stacking for Payroll Features Grid (Who Can Use AdoTeam) on <576px
  function initPayrollFeaturesStackAnimation() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    if (window.innerWidth >= 576) return;

    gsap.registerPlugin(ScrollTrigger);
    const pfcCards = gsap.utils.toArray(".payroll-features-grid .pfc-card");
    if (!pfcCards.length) return;

    pfcCards.forEach((card, i) => {
      card.style.zIndex = i + 1;

      if (i < pfcCards.length - 1) {
        gsap.to(card, {
          scale: 0.94,
          y: -10,
          opacity: 0.65,
          ease: "none",
          scrollTrigger: {
            trigger: pfcCards[i + 1],
            start: "top 75%",
            end: "top 25%",
            scrub: true,
          }
        });
      }

      if (i < pfcCards.length - 2) {
        gsap.to(card, {
          opacity: 0,
          pointerEvents: "none",
          ease: "none",
          scrollTrigger: {
            trigger: pfcCards[i + 2],
            start: "top 80%",
            end: "top 45%",
            scrub: true,
          }
        });
      }
    });
  }

  // Start data load, benchmarks & showcase banners
  initBenchmarks();
  renderShowcaseBanners();
  initLeaveScreenshotScroll();
  initPayrollFeaturesStackAnimation();
  window.addEventListener("resize", () => {
    if (window.innerWidth < 576) {
      initPayrollFeaturesStackAnimation();
    }
  }, { passive: true });

  if (typeof lucide !== "undefined" && typeof lucide.createIcons === "function") {
    lucide.createIcons();
  }
  loadHrmsData();
  loadClientsData();
});



