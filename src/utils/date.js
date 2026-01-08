export const createDate = () => {
    var day = (new Date().getDate()).toString().padStart(2, '0');
    var month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    var year = new Date().getFullYear();

    var todayDate = day + '.' + month + '.' + year;

    return todayDate;
}

export const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}