 // Pegando o dia da URL
 const urlParams = new URLSearchParams(window.location.search);
 const selectedDay = urlParams.get('day');

 // Atualizando o título com o dia selecionado
 const title = document.querySelector('#titulo-dia');
 if (selectedDay) {
     const diasSemana = {
         segunda: "Segunda-feira",
         terca: "Terça-feira",
         quarta: "Quarta-feira",
         quinta: "Quinta-feira",
         sexta: "Sexta-feira",
         sabado: "Sábado",
         domingo: "Domingo"
     };
     const diaFormatado = diasSemana[selectedDay.toLowerCase()] || selectedDay;
     title.textContent = `Escolha o horário disponível para ${diaFormatado} ⏰`;
 }