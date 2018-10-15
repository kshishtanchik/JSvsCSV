
window.onload = function () {
  let progress = document.getElementById("progressDiv");
  let progressBar = document.getElementById("progressBar");
  progressBar.style.width = '0%';
  progressBar.innerText = progressBar.style.width;
  progress.style.visibility = "hidden";
  document
    .querySelector("#inputGroupFile04")
    .addEventListener("change", onFilesSelect, false); // слушаем событие изменение выбора файла и обрабатываем его
};

const columnMJFile = [1, 2, 3, 7, 8, 9]; // номера колонок используемых в выборке из файла МУ_по_МЖ. 2,3 -фио и дата
const columnExportFile = [2, 3, 5, 6]; //номера колонок используемых в выборке из файлов export..2,3 -фио и дата
var filterTypeFles = /.csv/;
var filterNameFiles = /МУ_по_МЖ/; //, /export/]
var currentFileName = "";
var Export_Array = [];
var MY_MJ_Array = [];
var RESULT_DATA_ARRAY = [];



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
      console.log(
        "Папа загрузил МУ_по_МЖ", results.data.length
      );
    }
  });
  //console.log("Тестовый вывод МУ_поМЖ ", MY_MJ_Array);
  joinOnColumn(MY_MJ_Array, Export_Array)
  printArray(RESULT_DATA_ARRAY);
}

// Функция печать массива на страницу
function printArray(array) {
  //document.getElementById("main").appendChild(table); */
  let newtabla = document.createElement("table");
  newtabla.setAttribute("id", "dataTable");
  newtabla.classList = "table table-striped display stripe";
  document.getElementById("main").appendChild(newtabla);
  $('#dataTable').ready(function () {
    $('#dataTable').DataTable({
      data: array,
      columns: [
        { title: "Основание" },
        { title: "ФИО" },
        { title: "Дата рождения" },
        { title: "Дата регистрации" },
        { title: "Регистрациис" },
        { title: "Регистраци по" },
        { title: "Дата снятия с регистрации" },
        { title: "Тип дела" },
        { title: "Статус дела" }
      ],
      "columnDefs": [
        {
          "targets": [0],
          "visible": false,
          "searchable": false
        },
        {
          "targets": [7],
          "visible": false,
          "searchable": false
        },
        {
          "targets": [8],
          "visible": false,
          "searchable": false
        }
      ],
      "language": {
        "lengthMenu": "Отображать _MENU_ записей на странице",
        "zeroRecords": "Ничего не найдено",
        "info": "Показана _PAGE_ из _PAGES_",
        "infoEmpty": "Нет добавленных записей",
        "decimal": "",
        "emptyTable": "Пришла пустая страница",
        "infoEmpty": "Showing 0 to 0 of 0 entries",
        "infoFiltered": "(filtered from _MAX_ total entries)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Show _MENU_ entries",
        "loadingRecords": "Загрузка...",
        "processing": "В процессе...",
        "search": "Поиск:",
        "zeroRecords": "No matching records found",
        "paginate": {
          "first": "Начало",
          "last": "Конец",
          "next": "Следующая",
          "previous": "Предыдущая"
        },
        "aria": {
          "sortAscending": ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
        }
      },
      "paging": true,
    });
  });
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
    if (columns[index] === i) return true;
  }
  return false;
}

// Непосредственно выборка и обработка данных
function joinOnColumn(array_1, array_2) {
  let progress = document.getElementById("progressDiv");
  let progressBar = document.getElementById("progressBar");
  progressBar.style.visibility = "show";
  let percent = 100 / (array_1.length * array_2.length);
  let tmp = 0;

  for (const keyA1 in array_1) {
    if (array_1.hasOwnProperty(keyA1)) {
      const a1_element = array_1[keyA1];
      for (const keyA2 in array_2) {
        if (array_2.hasOwnProperty(keyA2)) {
          const a2_element = array_2[keyA2];

          tmp += tmp + percent;
          progressBar.style.width = tmp + '%';
          progressBar.innerText = progressBar.style.width;
          console.log(tmp)
          console.log("Сравниваем элементы выбранных массивов " + a1_element[1] + " " + a2_element[1]);
          if (a1_element[1] === a2_element[1]) {
            console.log("Выбрали в результирующий массив:", a1_element, a2_element[0], a2_element[2], a2_element[3]);
            a1_element.push(a2_element[0]);
            a1_element.push(a2_element[2]);
            a1_element.push(a2_element[3]);
            RESULT_DATA_ARRAY.push(a1_element);
          }

        }
      }
    }
  }
  alert("Сравнение выполнено");
  console.log(RESULT_DATA_ARRAY);
  if (RESULT_DATA_ARRAY.length > 0) downloadButton(RESULT_DATA_ARRAY);
}

function downloadButton(arrayForDown) {
  var typedArray = JSON.stringify(arrayForDown);
  var blob = new Blob([typedArray.buffer], { type: 'application/octet-stream' }); // pass a useful mime type here
  var url = URL.createObjectURL(blob);
  var downHref = document.createElement("a");
  downHref.classList = "nav-item nav-link";
  downHref.setAttribute("data-toggle", "tab");
  downHref.setAttribute("role", "tab");
  downHref.setAttribute("href", url);
  downHref.innerHTML = "Скачать таблицу";
  document.querySelector("#nav-tab").appendChild(downHref);

}
