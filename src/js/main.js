
let scrollpos = window.scrollY /* даем переменную скролу по У */

const header = document.querySelector(".nav") /* наш блок который будет менять */
const scrollChange = 1 /* шаг скрола */

const add_class_on_scroll = () => header.classList.add("nav_scroll") /* добавляем класс к блоку nav */
const remove_class_on_scroll = () => header.classList.remove("nav_scroll") /* убираем класс к блоку nav */

/* Функция скрола с условием */
window.addEventListener('scroll', function() { 
  scrollpos = window.scrollY;

  if (scrollpos >= scrollChange) { add_class_on_scroll() }
  else { remove_class_on_scroll() }
  
})


var swiper = new Swiper(".swiper", {
    slidesPerView: 2,
    spaceBetween: 60,

    navigation: {
        nextEl: '.swiper-button-next-unique',
        prevEl: '.swiper-button-prev-unique',
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    hiddenClass: 'swiper-button-hidden',
       
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 1,
                spaceBetween: 60,
                slideToClickedSlide: true,
            },
            // when window width is >= 480px
            480: {
                slidesPerView: 1,
                spaceBetween: 60,
                slideToClickedSlide: true,
            },
            // when window width is >= 640px
            640: {
                slidesPerView: 2,
                spaceBetween: 60,
                slideToClickedSlide: true,
            }
        }

});

/* Табы */

document.querySelectorAll('.tabs-nav__btn').forEach(function (tabsBtn) {
    tabsBtn.addEventListener('click', function (e) {
        const path = e.currentTarget.dataset.path;
        document.querySelectorAll('.tabs-nav__btn').forEach(function (btn) {
            btn.classList.remove('tabs-nav__btn--active')
        });
        e.currentTarget.classList.add('tabs-nav__btn--active');
        document.querySelectorAll('.tabs-item').forEach(function (tabsBtn) {
            tabsBtn.classList.remove('tabs-item--active')
        });
        document.querySelector(`[data-target="${path}"]`).classList.add('tabs-item--active');
    });
});


/* Карта */

ymaps.ready(init);
function init() {
    // Создание карты.
    var myMap = new ymaps.Map("map", {
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: [54.501294, 36.272938],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 16,
    });
    var myGeoObject = new ymaps.GeoObject({
        geometry: {
            type: "Point", // тип геометрии - точка
            coordinates: [54.501294, 36.272938] // координаты точки
        }
    });

    var myPlacemark = new ymaps.Placemark([54.501294, 36.272938], {}, {
        iconLayout: 'default#image',
        //iconImageHref: '/img/geo.svg',
        iconImageSize: [28, 40],
        /* iconImageOffset: [-3, -42] */
    });

    // Размещение геообъекта на карте.
    myMap.geoObjects.add(myPlacemark);

}

/* Закрытие адресса */

const cloceBtn = document.getElementById('mapCloce')
const addressMap = document.getElementById('addressMap')

cloceBtn.addEventListener('click', () => {
    addressMap.classList.add('cloce_map')
})

const contacts = document.getElementById('mapBlock')
contacts.addEventListener('click', () => {
    addressMap.classList.remove('cloce_map')
})



/* Маска для телефона */

window.addEventListener("DOMContentLoaded", function () {
    [].forEach.call(document.querySelectorAll('.tel'), function (input) {
        var keyCode;
        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            var pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            var matrix = "+7 (___) ___ ____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5) this.value = ""
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)

    });

});


/* Accordion */

new Accordion('.accordion-list', {
	elementClass: 'accordion',
	triggerClass: 'accordion__control',
	panelClass: 'accordion__content',
	activeClass: 'accordion--active'
});