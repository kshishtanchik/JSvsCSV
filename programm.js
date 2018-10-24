window.onload = function () {
  var progressBar = document.getElementById("progressBar");
  progressBar.style.width = "0%";
  progressBar.innerText = progressBar.style.width;
  document
    .querySelector("#inputGroupFile04")
    .addEventListener("change", onFilesSelect, false); // слушаем событие изменение выбора файла и обрабатываем его
};

const columnMJFile = [1, 2, 3, 7, 8, 9]; // номера колонок используемых в выборке из файла МУ_по_МЖ. 2,3 -фио и дата
const columnExportFile = [2, 3, 5, 6]; //номера колонок используемых в выборке из файлов export..2,3 -фио и дата
var filterTypeFles = /.csv/; // Можем работать только с этим форматом
var filterNameFiles = /МУ_по_МЖ/; // Выделяем файл
var currentFileName = "";
var Export_Array = [];
var MY_MJ_Array = [];
var RESULT_DATA_ARRAY = [];
var PERIOD_OF_VIOLATION_IN_DAY = 420; // Срок в днях для обнаружения нарушений сроков

function onFilesSelect(e) {
  var csv = e.target.files; // выбранные файлы
  var errorFiles = []; // файлы с ошибками

  for (var index = 0; index < csv.length; index++) {
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
    ? alert(
      "Выполнение программы продолжится после нажатия на кнопку ОК\nСледующий файл или файлы имеет не подходящий формат\n" +
      errorFiles.join("\n") +
      "В этом нет ничего страшного.\n Данная информация предназначена для ознакомления.\n Пока все работает в штатном режиме.\n"
    )
    : console.log("Все файлы имеют удовлетворительный формат");
}

// настраиваем обработчик на массовые выгрузки
function loadExport(evt) {
  var fileString = evt.target.result;
  Papa.parse(fileString, {
    step: filExportArray,
    complete: function (results) {
      console.log(
        "Папа закончил работу с файлом: ",
        fileString.name,
        "Добавленно записей: ",
        results.data.length
      );
    }
  });
  //console.log("Тестовый вывод загруженного экспорта ", Export_Array);
}

// настраиваем обработчик на  МУ_по_МЖ
function loadMJ(evt) {
  Papa.parse(evt.target.result, {
    step: filMY_MJ_Array,
    complete: function (results) {
      console.log("Папа загрузил МУ_по_МЖ", results.data.length);
    }
  });
  //console.log("Тестовый вывод МУ_поМЖ ", MY_MJ_Array);
  joinOnColumn(MY_MJ_Array, Export_Array);
}

// Функция печать массива на страницу
function printArray(array) {
  //document.getElementById("main").appendChild(table); */
  var newtabla = document.createElement("table");
  newtabla.setAttribute("id", "dataTable");
  newtabla.classList = "table table-striped table-sm";
  document.getElementById("main").appendChild(newtabla);
  $("#dataTable").ready(function () {
    $("#dataTable").DataTable({
      columns: [
        null,
        null,
        null,
        {
          data: "first_name", // can be null or undefined
          defaultContent: "<i>Not set</i>"
        }
      ],
      data: array,
      columns: [
        { title: "Основание" }, // 0
        { title: "ФИО" }, // 1
        { title: "Дата рождения" }, // 2
        { title: "Дата регистрации с" }, // 3
        { title: "Регистраци по" }, // 4
        { title: "Дата снятия с регистрации" }, // 5
        { title: "Дата приема заявления (или сегодня)" }, // 6
        { title: "Комментарий нарушения" }, // 7
        { title: "Комментарий нарушения" }, // 8
        { title: "Статус дела" } // 9
      ],
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      columnDefs: [
        {
          targets: [0],
          visible: false,
          searchable: false
        },
        {
          targets: [5],
          visible: false,
          searchable: false
        },
        {
          targets: [9],
          visible: true,
          searchable: false
        }
      ],
      language: {
        lengthMenu: "Отображать _MENU_ записей на странице",
        zeroRecords: "Ничего не найдено",
        info: "Показана _PAGE_ из _PAGES_ страниц из _TOTAL_ записей",
        infoEmpty: "Нет добавленных записей",
        decimal: "",
        emptyTable: "Пришла пустая страница",
        infoEmpty: "Showing 0 to 0 of 0 entries",
        infoFiltered: "(filtered from _MAX_ total entries)",
        infoPostFix: "",
        thousands: ",",
        loadingRecords: "Загрузка...",
        processing: "В процессе...",
        search: "Поиск:",
        zeroRecords: "No matching records found",
        paginate: {
          first: "Начало",
          last: "Конец",
          next: "Следующая",
          previous: "Предыдущая"
        },
        aria: {
          sortAscending: ": activate to sort column ascending",
          sortDescending: ": activate to sort column descending"
        }
      },
      paging: true
    });
  });
}

// Заполнение массива хранящего все значения файлов export согласно указанным номерам столбцов
function filExportArray(row) {
  var curRow = row.data[0];
  var expRow = [];
  var j = 0;
  for (var i = 0; i < curRow.length; i++) {
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
  var j = 0;
  for (var i = 0; i < curRow.length; i++) {
    if (isShowColumn(columnMJFile, i)) {
      formatedRow[j] = curRow[i];
      j++;
    }
  }
  MY_MJ_Array.push(formatedRow);
}

// Проверка соответствия заданным столбцам
function isShowColumn(columns, i) {
  for (var index = 0; index < columns.length; index++) {
    if (columns[index] === i) return true;
  }
  return false;
}

// Непосредственно выборка и обработка данных
function joinOnColumn(array_1, array_2) {

  for (const keyA2 in array_2) {
    if (array_2.hasOwnProperty(keyA2)) {
      const a2_element = array_2[keyA2];

      for (const keyA1 in array_1) {
        if (array_1.hasOwnProperty(keyA1)) {
          const a1_element = array_1[keyA1];
          if (
            a1_element[0] == "Регистрация на РВП" && // Выбираем тип регистрации
            a1_element[5] == "-" // Выбираем те кто еще не снялся с учета
          ) {

            var registrationDate = new Date(Date.parse(a1_element[3].replace(/(\d+) (\d+) (\d+)/, '$2/$1/$3')));// Дата регистрации
            // console.log("Прочитана дата регистрации: ", a1_element[3]);
            // console.log("Разобралась дата регистрации: ", registrationDate.toDateString());

            if (a1_element[1] == a2_element[1]) {// Сопоставляем элементы по фамилии
              var statementDate = new Date(Date.parse(a2_element[0].replace(/(\d+).(\d+).(\d+)/, '$2/$1/$3')));// Дата подачи заявления
              // console.log("Прочитана дата подачи заявления: ", a2_element[0]);
              // console.log("Разобрана дата подачи заявления: ", statementDate.toDateString());
              var difjs = (statementDate - registrationDate) / (1000 * 60 * 60 * 24);
              if (difjs >= PERIOD_OF_VIOLATION_IN_DAY) { // Выявляем нарушение сроков подачи
                var addRow = [];
                for (let i = 0; i < a1_element.length; i++) {
                  addRow[i] = a1_element[i];
                }
                addRow.push(a2_element[0]); // Добавляем дату подачи
                addRow.push("Заявление подано с опозданием на " + Math.round(difjs - PERIOD_OF_VIOLATION_IN_DAY) + " дней");// Добавляе разницу
                console.log("Добавлен элемент:", addRow);
                RESULT_DATA_ARRAY.push(addRow);
              }
            } else {
              var toDay = new Date();
              var difUnreg = (toDay - registrationDate) / (1000 * 60 * 60 * 24);
              if (
                difUnreg >= PERIOD_OF_VIOLATION_IN_DAY// Выявляем нарушение сроков не подачи
              ) {
                var addRow = [];
                for (let i = 0; i < a1_element.length; i++) {
                  addRow[i] = a1_element[i];
                }
                addRow.push(toDay.toLocaleDateString());
                addRow.push("Пропущен максимальный срок подачи заявления на " + Math.round(difUnreg - PERIOD_OF_VIOLATION_IN_DAY) + " дней");
                console.log("Добавлен элемент:", addRow);
                RESULT_DATA_ARRAY.push(addRow);
              }
            }
          }
        }
      }
    }
  }
  progressBar.innerHTML = "Сравнение выполнено!";
  printArray(RESULT_DATA_ARRAY);
  /*if (RESULT_DATA_ARRAY.length > 0) downloadButton(RESULT_DATA_ARRAY); */
}
