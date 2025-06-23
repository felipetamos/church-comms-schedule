
import { Schedule } from '@/types/team';

export function exportToExcel(schedule: Schedule) {
  // Create CSV content
  let csvContent = 'Data,Horário,Evento,Função,Responsável\n';
  
  schedule.events.forEach(event => {
    event.assignments.forEach(assignment => {
      csvContent += `${event.date.toLocaleDateString()},${event.time},${event.title},${assignment.function},${assignment.memberName}\n`;
    });
  });
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${schedule.name}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(schedule: Schedule) {
  // Create HTML content for PDF
  let htmlContent = `
    <html>
      <head>
        <title>${schedule.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .event-group { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>${schedule.name}</h1>
        <p>Período: ${schedule.startDate.toLocaleDateString()} - ${schedule.endDate.toLocaleDateString()}</p>
        
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Evento</th>
              <th>Função</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
  `;
  
  schedule.events.forEach(event => {
    event.assignments.forEach(assignment => {
      htmlContent += `
        <tr>
          <td>${event.date.toLocaleDateString()}</td>
          <td>${event.time}</td>
          <td>${event.title}</td>
          <td>${assignment.function}</td>
          <td>${assignment.memberName}</td>
        </tr>
      `;
    });
  });
  
  htmlContent += `
          </tbody>
        </table>
      </body>
    </html>
  `;
  
  // Open in new window for printing/saving as PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 100);
  }
}
