window.onload = function() {
  var table = document.createElement("table"); // Создаем элемент таблицу для вывода
  table.setAttribute("id", "mainTable"); // задаем id
  table.className = "table table-responsive striped"; // украшаем bootstrap классами
  document.getElementById("main").appendChild(table); // добавляем таблицу на страницу

  document
    .querySelector("#inputGroupFile04")
    .addEventListener("change", onFilesSelect, false); // слушаем событие изменение выбора файла и обрабатываем его
};

const columnMJFile = [1, 2, 3, 4, 7, 8, 9]; // номера колонок используемых в выборке из файла МУ_по_МЖ..
const columnExportFile = [2, 3, 5, 6]; //номера колонок используемых в выборке из файлов export..
var filterTypeFles = /.csv/;
var filterNameFiles = /МУ_по_МЖ/; //, /export/]
var currentFileName = "";
var Export_Array = [];
var MY_MJ_Array = [];

function onFilesSelect(e) {
  var csv = e.target.files; // выбранные файлы
  var errorFiles = []; // файлы с ошибками

  for (let index = 0; index < csv.length; index++) {
    // обходим список файлов
    if (filterTypeFles.test(csv[index].name)) {
      // фильтруем выбраные файлы по маске в filterTypeFiles
      console.log(csv[index].name);
      var reader = new FileReader();
      reader.readAsText(
        /*Правильно кодируем и читаем файл */
        csv[index],
        "Windows-1251"
      );
      reader.onloadend = console.log("Читаем файл..", reader);
      !filterNameFiles.test(csv[index].name)
        ? (reader.onload = loadExport)
        : (reader.onload = loadMJ); // обрабатываем файл
      currentFileName = csv[index].name;
    } else errorFiles.push(csv[index].name);
  }
  console.log("Файлы сошибками:", errorFiles);
  errorFiles.length > 0
    ? alert(errorFiles.join("\n") + "\n Файл имеет не подходящий формат")
    : alert("Все файлы обработаны успешно");
}

// настраиваем обработчик на массовые выгрузки
function loadExport(evt) {
  var fileString = evt.target.result;
  Papa.parse(fileString, {
    step: filExportArray,
    complete: function(results) {
      console.log(
        "Папа закончил работу с файлом: ",
        fileString.name,
        "Добавленно записей: ",
        results.length
      );
    }
  });
}

// настраиваем обработчик на  МУ_по_МЖ
function loadMJ(e) {
  Papa.parse(e.target.result, {
    step: filMY_MJ_Array,
    complete: function(results) {
      console.log(
        "Папа закончил работу с файлом: ",
        fileString.name,
        "Добавленно записей: ",
        results.length
      );
    }
  });
}

// Функция печать массива на страницу
function showByStep(row) {
  var fRow = row.data[0];
  var tr = document.createElement("tr");
  for (let i = 0; i < fRow.length; i++) {
    var cell = document.createElement("td");
    cell.innerHTML = fRow[i];
    tr.appendChild(cell);
  }
  var chek = document.createElement("input").setAttribute("type", "chekbox");
  var chekCell = document.createElement("td");
  chekCell.appendChild(chek);
  tr.appendChild(chekCell);
  var table = document.querySelector("#mainTable");
  table.appendChild(tr);
}

// Заполнение массива хранящего все значения файлов export согласно указанным номерам столбцов
function filExportArray(row) {
  var curRow = row.data[0];
  let expRow = [];
  let j = 0;
  for (let i = 0; i < curRow.length; i++) {
    if (isShowColumn(columnExportFile, i)) {
      expRow[j] = curRow[i];
      j++;
    }
  }
  Export_Array.push(expRow);
}

// Заполнение массива МУ_по_МЖ
function filMY_MJ_Array(row) {
  var curRow = row.data[0];
  var formatedRow = [];
  let j = 0;
  for (let i = 0; i < curRow.length; i++) {
    if (isShowColumn(columnMJFile, i)) {
      formatedRow[j] = curRow[i];
      j++;
    }
  }
  MY_MJ_Array.push(formatedRow);
}

// Проверка соответствия заданным столбцам
function isShowColumn(columns, i) {
  for (let index = 0; index < columns.length; index++) {
    if (columnExportFile[index] === i) return true;
  }
  return false;
}

// Непосредственно выборка и обработка данных
function completeCombiner(Export_Array, MY_MJ_Array) {
  var resultArray = [];
}

function getAddinationData(selectivArray, selectivedRow) {
  selectivArray.map(function(row) {
    row.array.forEach(element => {});
  });
}
