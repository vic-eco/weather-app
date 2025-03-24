function capitalizeWords(str) {
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
  
    const year = date.getFullYear();
    const month = String(date.getMonth()+1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatTimestampForModal(timestamp) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const date = new Date(timestamp * 1000);
  
    const year = date.getFullYear();
    const month = date.getMonth()
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day} ${months[month]} ${year} ${hours}:${minutes}`;
}