import { useState, useEffect } from "react";

export const Twse = () => {
  const [data, setData] = useState<{ time: string; value: number }[]>([]);

  const convertToISODate = (taiwanDate: string): string => {
    const [year, month, day] = taiwanDate.split('/');
    const westernYear = parseInt(year, 10) + 1911;
    return `${westernYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  function getRandomDate() {
    const start = new Date('2010-01-01').getTime();
    const end = new Date('2024-01-01').getTime();
  
    const randomTimestamp = Math.random() * (end - start) + start;
  
    return new Date(randomTimestamp).toISOString().split('T')[0];
  }

  function getRandomNo(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
  }

const twse = 'https://www.twse.com.tw/rwd/zh/afterTrading/';
const n = 'STOCK_DAY?date='+getRandomDate()+'&stockNo='+getRandomNo(2880,2892)+'&response=json'

  useEffect(() => {
    fetch(`${twse}${n}`)
      .then((res) => res.json())
      .then((resJson) => {
        const newData = resJson.data.map((item: Array<string | number>) => ({
          time: convertToISODate(item[0] as string), 
          value: parseFloat(item[6] as string),
        }));
        setData(newData);
      })
      .catch((err) => console.log(err));
  }, []);

  return data;
};