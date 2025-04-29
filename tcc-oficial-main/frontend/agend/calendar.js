document.addEventListener('DOMContentLoaded', function() {

    const API_KEY = 'AIzaSyCxp4_wZihdmOUyzT9LRUdv5M7y5CAlfnY'; // Sua chave de API
    const CALENDAR_ID = '8409cc97bc06da94c634e20babae81e65c79092130cd677bbfebdcf844d98267@group.calendar.google.com'; // ID do seu calendário

    let request_calendar = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`; // URL de requisição da API do Google Calendar

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'pt-br',
        initialView: 'dayGridMonth',

        events: function(info, successCallback, failureCallback){
            fetch(request_calendar)
                .then(function(response){
                    return response.json();
                })
                .then(function(data){
                    let events = data.items.map(function(event){
                        // Convertendo os tempos para formato de 24h
                        let startTime = new Date(event.start.dateTime || event.start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        let endTime = new Date(event.end.dateTime || event.end.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return {
                            title: event.summary,
                            start: event.start.dateTime || event.start.date, // Verifique se o evento tem data e hora
                            end: event.end.dateTime || event.end.date,
                            url: event.htmlLink, // Link para o evento no Google Calendar
                            location: event.location,
                            timeStart: startTime,
                            timeEnd: endTime,
                        };
                    });
                    successCallback(events);
                })
                .catch(function(error){
                    failureCallback(error);
                });
        },

        eventContent: function(info){
            return {
                html: `
                <div style="overflow: hidden; font-size: 12px; position: relative; cursor: pointer; font-family: 'Inter', sans-serif;">
                    <div><strong>${info.event.title}</strong></div>
                    <div>${info.event.extendedProps.timeStart}-${info.event.extendedProps.timeEnd}hrs</div>
                </div>
                `
            };
        },

        eventMouseEnter: function(mouseEnterInfo){
            let el = mouseEnterInfo.el;
            el.classList.add("relative");

            let newEl = document.createElement("div");
            let newElTitle = mouseEnterInfo.event.title;
            let newElLocation = mouseEnterInfo.event.extendedProps.location;
            newEl.innerHTML = `
                <div
                    class="fc-hoverable-event"
                    style="position: absolute; bottom: 100%; left: 0; width: 300px; height: auto; background-color: white; z-index: 50; border: 1px solid #e2e8f0; border-radius: 0.375rem; padding: 0.75rem; font-size: 14px; font-family: 'Inter', sans-serif; cursor: pointer;"
                >
                    <strong>${newElTitle}</strong>
                    <div>Location: ${newElLocation}</div>
                </div>
            `;
            el.after(newEl);
        },

        eventMouseLeave: function(){
            document.querySelector(".fc-hoverable-event").remove();
        }
    });

    calendar.render();
   
  
});
