document.addEventListener("DOMContentLoaded", function () {
  const API_KEY = "AIzaSyCxp4_wZihdmOUyzT9LRUdv5M7y5CAlfnY";
  const CALENDAR_ID = "8409cc97bc06da94c634e20babae81e65c79092130cd677bbfebdcf844d98267@group.calendar.google.com";

  // Corrige URL (espaço extra removido)
  const requestUrl = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`;

  const calendarEl = document.getElementById("calendar");

  if (!calendarEl) {
    console.error("Elemento #calendar não encontrado.");
    return;
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    locale: "pt-br",
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
    },
    firstDay: 1, // Segunda-feira como primeiro dia da semana
    editable: false,
    selectable: false,
    dayMaxEvents: true,
    nowIndicator: true,
    events: function (fetchInfo, successCallback, failureCallback) {
      fetch(requestUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const events = data.items
            .filter((event) => event.status !== "cancelled") // Ignora eventos cancelados
            .map((event) => {
              const start = event.start.dateTime || event.start.date;
              const end = event.end.dateTime || event.end.date;

              // Formata horários (apenas se for evento com hora)
              const hasTime = event.start.dateTime;
              const timeStart = hasTime
                ? new Date(event.start.dateTime).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "";
              const timeEnd = hasTime
                ? new Date(event.end.dateTime).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "";

              return {
                title: event.summary || "Evento sem título",
                start: start,
                end: end,
                url: event.htmlLink,
                location: event.location || "Local não informado",
                extendedProps: {
                  timeStart,
                  timeEnd,
                  location: event.location || "Não informado"
                },
                classNames: [
                  "fc-event-custom"
                ] // Para estilização personalizada
              };
            });
          successCallback(events);
        })
        .catch((error) => {
          console.error("Erro ao carregar eventos do Google Calendar:", error);
          failureCallback(error);
          // Opcional: mostrar mensagem no calendário
          successCallback([]); // Mostra calendário vazio, mas não quebra
        });
    },

    // Renderização personalizada dos eventos
    eventContent: function (info) {
      const timeText = info.event.extendedProps.timeStart
        ? `${info.event.extendedProps.timeStart} - ${info.event.extendedProps.timeEnd}h`
        : "Dia inteiro";

      return {
        html: `
          <div style="
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          ">
            <strong>${info.event.title}</strong><br/>
            <small>${timeText}</small>
          </div>
        `
      };
    },

    // Efeito de hover com tooltip
    eventMouseEnter: function (mouseEnterInfo) {
      const tooltip = document.createElement("div");
      tooltip.className = "fc-tooltip";
      tooltip.innerHTML = `
        <div style="
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          background: white;
          color: #333;
          border-radius: 8px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          padding: 12px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          z-index: 1000;
          white-space: normal;
          line-height: 1.5;
          text-align: left;
          border: 1px solid #e2e8f0;
        ">
          <strong>${info.event.title}</strong><br/>
          <small><i class="fas fa-clock"></i> ${info.event.extendedProps.timeStart || 'Dia inteiro'}</small><br/>
          <small><i class="fas fa-map-marker-alt"></i> ${info.event.extendedProps.location}</small><br/>
          <a href="${info.event.url}" target="_blank" style="
            color: #b18788;
            text-decoration: none;
            font-weight: 600;
            margin-top: 8px;
            display: inline-block;
          ">Ver no Google Calendar</a>
        </div>
      `;
      mouseEnterInfo.el.appendChild(tooltip);
    },

    eventMouseLeave: function (mouseLeaveInfo) {
      const tooltip = mouseLeaveInfo.el.querySelector(".fc-tooltip");
      if (tooltip) {
        tooltip.remove();
      }
    }
  });

  // Renderiza o calendário
  calendar.render();
});

// =============== SCROLL ANIMATION (feedbacks) ===============
// Separado para evitar conflito com FullCalendar

document.addEventListener("DOMContentLoaded", () => {
  const feedbackCards = document.querySelectorAll(".feedback-card");
  const feedbacksSection = document.querySelector(".feedbacks");

  if (!feedbacksSection) return;

  let sectionTop = 0;
  let inView = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !inView) {
          sectionTop = window.scrollY;
          inView = true;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(feedbacksSection);

  window.addEventListener("scroll", () => {
    if (!inView) return;

    const scrollOffset = window.scrollY - sectionTop;

    feedbackCards.forEach((card, index) => {
      // Ajuste de velocidade: quanto maior o índice, mais lento
      const speed = 0.2 + index * 0.2; // 0.2, 0.4, 0.6
      card.style.transform = `translateY(${-scrollOffset * speed}px)`;
    });
  });
});