window.onload = function () {
  /*   var header = document.createElement("h1");
  console.log(header);
  header.innerText = "Работа с таблицами CSV";
  document.getElementById("main").appendChild(header); */
  /* var input = document.createElement("input");
  input.setAttribute("type", "file");
  document.getElementById("main").appendChild(input); */

  var table = document.createElement("table");// Создаем элемент таблицу для вывода
  table.setAttribute("id", "mainTable");// задаем id
  table.className = "table table-responsive striped";// украшаем bootstrap классами
  document.getElementById("main").appendChild(table);// добавляем таблицу на страницу

  document
    .querySelector("#inputGroupFile04")
    .addEventListener("change", onFilesSelect, false); // слушаем событие изменение выбора файла и обрабатываем его
};

var filterTypeFles = /.csv/;
var filterNameFiles = /МУ_по_МЖ/;//, /export/]
var currentFileName = "";
const columnMJFile = [1, 2, 3, 4, 7, 8, 9];// номера колонок используемых в выборке из файла МУ_по_МЖ..
const columnExportFile = [2, 3, 6]//номера колонок используемых в выборке из файлов export..

function onFilesSelect(e) {
  var csv = e.target.files;// выбранные файлы
  var errorFiles = [];// файлы с ошибками

  for (let index = 0; index < csv.length; index++) {// обходим список файлов 
    if (filterTypeFles.test(csv[index].name)) {// фильтруем выбраные файлы по маске в filterTypeFiles
      console.log(csv[index].name);
      var reader = new FileReader();
      reader.readAsText(              /*Правильно кодируем и читаем файл */
        csv[index],
        "Windows-1251"
      );
      reader.onloadend = console.log("Читаем файл..", reader);
      !filterNameFiles.test(csv[index].name)
        ? reader.onload = loaded
        : reader.onload = loadMJ;                   // обрабатываем файл
      currentFileName = csv[index].name;
    } else errorFiles.push(csv[index].name);
  }
  console.log("Файлы сошибками:", errorFiles);
  errorFiles.length > 0
    ? alert(errorFiles.join("\n") + "\n Файл имеет не подходящий формат")
    : alert("Все файлы обработаны успешно");
};

// настраиваем обработчик на массовые выгрузки
function loaded(evt) {
  var fileString = evt.target.result;
  //console.log("Папа ведет разбор:", evt);
  //
  Papa.parse(fileString, {
    /* header: true, */step: function (row) {
      showByStep(row);
    },
    complete: function (results) {
      console.log("Папа закончил работу...", results.data.length);
    }
  });
};

// настраиваем обработчик на  МУ_по_МЖ
function loadMJ(e) {
  Papa.parse(e.target.result, {
    step: function (row) {
      console.log("Обрабатываем МУ_по_МЖ..\n", row.data[0]);

    },
    complete: function (results) {
      console.log("Папа закончил работу..");
    }
  });
}

// Обработчик строк. Формирует строку и добавляет в таблицу
function showByStep(row) {
  var fRow = row.data[0];
  var tr = document.createElement("tr");
  for (let i = 0; i < fRow.length; i++) {
    if (isShowColumn(showedColumn, i)) {
      var cell = document.createElement("td");
      cell.innerHTML = fRow[i];
      tr.appendChild(cell);
    }
  }
  var table = document.querySelector("#mainTable");
  table.appendChild(tr);
}

const showedColumn = [1, 2, 3, 4];//номера обрабатываемых колонок

function isShowColumn(columnExportFile, i) {
  for (let index = 0; index < columnExportFile.length; index++) {
    if (columnExportFile[index] === i) return true;
  }
  return false;
}