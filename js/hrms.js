/**
 * Adomantra HRMS - Dynamic Data Hydration & Module Showcase
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
          title: "Executive & Employee Dashboard",
          badge: "Control Center",
          description: "Real-time workforce presence cockpit, shift coverage counters, and quick employee actions.",
          features: ["Real-time presence feed", "1-Click mobile punch status", "Upcoming shift schedules & birthdays"],
          tags: ["Real-Time Feed", "Action Center", "Live Headcount"],
          statVal: "100%",
          statLbl: "Live visibility",
          pexelsQuery: "modern office corporate dashboard analytics computer screen human resources",
          icon: "fa-gauge-high"
        },
        {
          id: "employee-management",
          num: "02",
          title: "Employee Lifecycle & Directory",
          badge: "Workforce Master",
          description: "Paperless digital onboarding, confidential KYC records, asset tracking, and searchable directory.",
          features: ["E-sign offer letters & KYC docs", "Hierarchical org directory", "Hardware asset assignments"],
          tags: ["Digital KYC", "Org Directory", "Asset Tracking"],
          statVal: "3x Faster",
          statLbl: "Onboarding Speed",
          pexelsQuery: "corporate employee badge office professional onboarding human resources",
          icon: "fa-users-gear"
        },
        {
          id: "attendance-management",
          num: "03",
          title: "Attendance & Geo-Location Punch",
          badge: "Geo-Fenced Clock-In",
          description: "Precision mobile clock-in/out with GPS boundary enforcement, facial selfie check, and biometric cloud sync.",
          features: ["Geo-fence boundary (10m-500m)", "Biometric sync (eSSL, ZKTeco)", "Overtime & late-in tracking"],
          tags: ["GPS Geo-Fencing", "Zero Proxy", "Biometric Sync"],
          statVal: "99.8%",
          statLbl: "GPS Accuracy",
          pexelsQuery: "business person using smartphone geo location modern office building check in",
          icon: "fa-location-dot"
        },
        {
          id: "leave-management",
          num: "04",
          title: "Leave Management & Approvals",
          badge: "Policy Automation",
          description: "Automated leave quota ledgers (CL, SL, PL), sandwich rule calculations, and 1-click multi-tier manager approvals.",
          features: ["Real-time leave balance ledgers", "Sandwich weekend policy rules", "Instant push & email approvals"],
          tags: ["Multi-Tier Flow", "Sandwich Rules", "Real-Time Balance"],
          statVal: "4.8x",
          statLbl: "Approval Velocity",
          pexelsQuery: "professional business person planning calendar vacation laptop office",
          icon: "fa-calendar-check"
        },
        {
          id: "regularization-management",
          num: "05",
          title: "Regularization & Dispute Resolution",
          badge: "Audit & Compliance",
          description: "Frictionless workflow for missed punches, biometric hardware discrepancies, and outdoor client visits.",
          features: ["Outdoor Duty (OD) logs", "Missed punch request flow", "Detailed HR audit trails"],
          tags: ["Missed Punch", "OD Tracking", "Audit Logs"],
          statVal: "-94%",
          statLbl: "Dispute Rate",
          pexelsQuery: "business executives reviewing reports and approval tablet office discussion",
          icon: "fa-clock-rotate-left"
        },
        {
          id: "team-mates",
          num: "06",
          title: "Team Mates & Dynamic Org Hierarchy",
          badge: "Team Collaboration",
          description: "Visual reporting lines, skill matrices, peer presence indicators (Office, Remote, Leave), and shift collaboration.",
          features: ["Visual reporting lines", "Real-time presence tags", "Departmental contact directory"],
          tags: ["Org Hierarchy", "Live Presence", "Skill Matrix"],
          statVal: "1-Click",
          statLbl: "Team Discovery",
          pexelsQuery: "diverse business corporate team collaborating around conference table happy",
          icon: "fa-people-group"
        },
        {
          id: "calendar",
          num: "07",
          title: "Shift & Holiday Calendar",
          badge: "Roster Management",
          description: "Multi-branch holiday rosters, 24/7 rotational shift schedules, and synchronized team calendars.",
          features: ["Multi-location holiday schedules", "Rotational night/day shifts", "Google & Outlook calendar sync"],
          tags: ["Shift Rosters", "Multi-Branch", "Calendar Sync"],
          statVal: "24/7",
          statLbl: "Shift Coverage",
          pexelsQuery: "modern digital calendar schedule on tablet executive planning office",
          icon: "fa-calendar-days"
        },
        {
          id: "payroll-salary",
          num: "08",
          title: "Salary Slip & Automated Payroll",
          badge: "1-Click Payroll",
          description: "Automated gross-to-net calculation with statutory PF, ESI, PT, TDS deductions, and password-protected PDF salary slips.",
          features: ["1-Click automated payroll runs", "Statutory PF, ESI, PT & TDS", "Encrypted digital salary slips"],
          tags: ["1-Click Run", "PF & ESI Direct", "Form 16 Sync"],
          statVal: "100%",
          statLbl: "Statutory Compliance",
          pexelsQuery: "financial accounting payroll spreadsheet calculation corporate finance",
          icon: "fa-file-invoice-dollar"
        },
        {
          id: "analytics-reports",
          num: "09",
          title: "Workforce Analytics & Compliance",
          badge: "BI Intelligence",
          description: "Attrition analytics, attendance heatmaps, overtime expenditure forecasting, and one-click statutory compliance export.",
          features: ["Headcount & cost BI charts", "Overtime expenditure heatmap", "PF ECR & state labor reports"],
          tags: ["Executive BI", "Cost Control", "Audit Ready"],
          statVal: "40+ Reports",
          statLbl: "Instant Exports",
          pexelsQuery: "business data intelligence analytics charts graphs presentation screen",
          icon: "fa-chart-pie"
        }
      ];
      renderModules(fallbackModules);
    }
  }

  // Render modules into .services-swiper with exact pre-made CSS classes & numbers
  function renderModules(modules) {
    if (!moduleWrapper) return;
    moduleWrapper.innerHTML = "";

    modules.forEach((mod) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      const tagsHtml = (mod.tags || (mod.features ? mod.features.slice(0, 3) : []))
        .map((tag) => `<span>${tag}</span>`)
        .join("");

      slide.innerHTML = `
        <div class="service-feature-card with-image" data-module-id="${mod.id}" style="cursor: pointer;">
          <div class="sfc-image-wrap">
            <img data-pexels-query="${mod.pexelsQuery}" alt="${mod.title}" class="sfc-bg-img" />
            <div class="sfc-overlay"></div>
          </div>
          <div class="sfc-content">
            <div class="sfc-header">
              <div class="sfc-icon"><i class="fa-solid ${mod.icon || 'fa-cubes'}"></i></div>
              <span class="sfc-num">${mod.num}</span>
            </div>
            <h3 class="sfc-title">${mod.title}</h3>
            <p class="sfc-desc">${mod.description || mod.summary}</p>
            <div class="sfc-tags">
              ${tagsHtml}
            </div>
            <span class="sfc-link-btn mt-3">
              Explore Module Details <i class="fa-solid fa-arrow-right"></i>
            </span>
          </div>
        </div>
      `;

      // Click event for modal
      const card = slide.querySelector(".service-feature-card");
      card.addEventListener("click", (e) => {
        e.preventDefault();
        openModuleModal(mod);
      });

      moduleWrapper.appendChild(slide);

      // Trigger Pexels dynamic image if available
      const imgEl = slide.querySelector("img[data-pexels-query]");
      if (imgEl && window.PexelsAPI && window.PexelsAPI.applyImageToElement) {
        window.PexelsAPI.applyImageToElement(imgEl, mod.pexelsQuery, "medium");
      }
    });

    // Re-initialize or update Swiper
    initOrUpdateSwiper();
  }

  // Initialize Swiper with existing pre-made classes
  let servicesSwiper = null;
  function initOrUpdateSwiper() {
    if (typeof Swiper === "undefined") return;

    if (servicesSwiper) {
      servicesSwiper.update();
      return;
    }

    if (document.querySelector(".services-swiper")) {
      servicesSwiper = new Swiper(".services-swiper", {
        slidesPerView: 1.1,
        spaceBetween: 24,
        loop: true,
        navigation: {
          nextEl: ".services-swiper-next",
          prevEl: ".services-swiper-prev",
        },
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        speed: 800,
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 28 },
          1024: { slidesPerView: 3, spaceBetween: 32 },
          1400: { slidesPerView: 3, spaceBetween: 36 },
        },
      });
    }
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
      solution: "Deployed Adomantra HRMS with mobile GPS geo-fenced clock-in (50m store radius perimeter) synchronized with biometric cloud terminals and real-time shift alerts.",
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

  function initBenchmarks() {
    const tabsContainer = document.getElementById("benchmarkTabs");
    if (!tabsContainer) return;

    tabsContainer.innerHTML = "";

    benchmarksData.forEach((item, index) => {
      const tab = document.createElement("div");
      tab.className = `clean-tab-item ${index === 0 ? "is-active" : ""}`;
      tab.setAttribute("data-index", index);

      tab.innerHTML = `
        <div class="cti-main">
          <span class="cti-metric">${item.metric}</span>
          <span class="cti-title">${item.title}</span>
        </div>
        <i class="fa-solid fa-chevron-right cti-arrow"></i>
      `;

      tab.addEventListener("click", () => {
        switchBenchmark(index);
      });

      tabsContainer.appendChild(tab);
    });

    // Initial render
    switchBenchmark(0);
  }

  function switchBenchmark(index) {
    const data = benchmarksData[index];
    if (!data) return;

    // Update active tab styles on left
    const allTabs = document.querySelectorAll(".clean-tab-item");
    allTabs.forEach((tab, i) => {
      if (i === index) {
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

    // Update minimal comparison strip values
    const stripOtherVal = document.getElementById("stripOtherVal");
    const stripOtherPill = document.getElementById("stripOtherPill");
    const stripUsVal = document.getElementById("stripUsVal");
    const stripUsPill = document.getElementById("stripUsPill");

    if (stripOtherVal && data.otherStrip) stripOtherVal.textContent = data.otherStrip.val;
    if (stripOtherPill && data.otherStrip) {
      stripOtherPill.textContent = data.otherStrip.pill;
      stripOtherPill.className = `status-pill ${data.otherStrip.pillClass}`;
    }

    if (stripUsVal && data.usStrip) stripUsVal.textContent = data.usStrip.val;
    if (stripUsPill && data.usStrip) {
      stripUsPill.textContent = data.usStrip.pill;
      stripUsPill.className = `status-pill ${data.usStrip.pillClass}`;
    }

    // Render minimal, Apple-style Chart.js with primary color
    renderMinimalistChart(data);
  }

  function renderMinimalistChart(data) {
    const canvas = document.getElementById("benchmarkChart");
    if (!canvas || typeof Chart === "undefined") return;

    const ctx = canvas.getContext("2d");
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Primary Brand Blue: #1257A2 (RGB: 18, 87, 162)
    const gradientUs = ctx.createLinearGradient(0, 0, 0, 200);
    gradientUs.addColorStop(0, "rgba(18, 87, 162, 0.22)");
    gradientUs.addColorStop(1, "rgba(18, 87, 162, 0.00)");

    const gradientOther = ctx.createLinearGradient(0, 0, 0, 200);
    gradientOther.addColorStop(0, "rgba(239, 68, 68, 0.12)");
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
            borderWidth: 2,
            pointBackgroundColor: "#EF4444",
            pointBorderColor: "#FFFFFF",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: true
          },
          {
            label: "Adomantra HRMS",
            data: data.usData,
            borderColor: "#1257A2",
            backgroundColor: gradientUs,
            borderWidth: 2.8,
            pointBackgroundColor: "#1257A2",
            pointBorderColor: "#FFFFFF",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 450,
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
              color: "#9CA3AF",
              font: { family: "'Google Sans Text', sans-serif", size: 11, weight: "500" }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "#F3F4F6",
              drawBorder: false
            },
            ticks: {
              color: "#9CA3AF",
              font: { family: "'Google Sans Text', sans-serif", size: 10 },
              maxTicksLimit: 4,
              callback: function (val) {
                return val + (data.yUnit || "");
              }
            }
          }
        }
      }
    });
  }

  // Start data load & benchmarks
  initBenchmarks();
  loadHrmsData();
});
