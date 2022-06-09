const moment = require("moment");

exports.scope = class scope {
  handupMessage = "";
  MessageAskwhoWar = `<@&706907362153332787> ใครวอบ้างค้าบวันนี้ยกมือเลยย ช้าอด\n ${String(moment().format('DD/MM/YYYY')) +"\n"}`
  MessageRandomPosition = `คนวอครบแล้ว!!! มาสุ่มตำแหน่งกันดีกว่า\n ${String(moment().format("DD/MM/YYYY")) + "\n"}`;
  warPerson = [];
  AllRandomPerson = [];
  RandomPositionMessage = null;
  PersonModel = {
    id: "",
    username: "",
  };
  AllPosition = [
    {
      position: "หน้าบ้านเรา",
      item: [0],
      press: ["แท่นหน้าบ้านเรา", "แท่นกลางซ้าย"],
    },
    {
      position: "ซ้าย",
      item: [10, 11],
      press: ["แท่นซ้ายบน", "แท่นซ้ายล่าง"],
    },
    {
      position: "กลาง",
      item: [1, 2],
      press: ["ถ้ายึดกลางได้ก็ดูเซ็ตกลาง"],
    },
    {
      position: "ขวา",
      item: [6, 9, 12],
      press: ["แท่นขวาล่าง", "แท่นขวาบน"],
    },
    {
      position: "ซ้ายบนสุด",
      item: [7, 8],
      press: ["แท่นซ้ายบนสุด"],
    },
    {
      position: "ขวาล่างสุด",
      item: [3],
      press: ["แท่นขวาล่างสุด"],
    },
    {
      position: "โรม",
      item: [5, 14],
      press: ["แท่นกลางขวา"],
    },
    {
      position: "หน้าบ้านมัน",
      item: [4, 13],
      press: ["แท่นหน้าบ้านมัน", "ถ้าว่างก็ไปช่วยแท่นกลางขวา"],
    },
  ];
};
