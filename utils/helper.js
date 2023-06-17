import moment from 'moment/moment';
export function getRelativeDay(inputDate,status) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedCurrentDate = `${year}-${month}-${day}`;

    const inputDateObj = new Date(inputDate);
    const inputDateDay = String(inputDateObj.getDate()).padStart(2, '0');
    const inputDateMonth = inputDateObj.toLocaleString('default', { month: 'short' });
    const inputDateYear = String(inputDateObj.getFullYear()).slice(-2);

    const formattedInputDate = `${inputDateDay} ${inputDateMonth} ${inputDateYear}`;


    console.log(formattedCurrentDate,inputDate)
    const isPast = inputDate < formattedCurrentDate;
    if(isPast) return [formattedInputDate,''];
    const today = moment().startOf('day');
    const targetDate = moment(inputDate).startOf('day');
    const diffDays = targetDate.diff(today, 'days');
    let relativeDay = '';

    if (diffDays === 0) {
      relativeDay = 'Aaj';
    } else if (diffDays === 1) {
      relativeDay = 'Kal';
    } else if (diffDays === 2) {
      relativeDay = 'Parso';
    } else {
      relativeDay = moment(inputDate).format('dddd'); // If more than 2 days, display the day of the week
    }
    if(status === 'out for delivery') return [relativeDay,'bg-lime-300 font-bold text-black'];
    else return [relativeDay,'']
  }

  export const detectObjectChange = (obj1, obj2) => {
    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // If the number of keys is different, objects are not equal
    if (keys1.length !== keys2.length) {
      return true;
    }

    // Compare the values of each key in both objects
    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return true;
      }
    }

    // All keys and values are equal, objects are equal
    return false;
  };