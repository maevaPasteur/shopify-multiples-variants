let data = {};
let colors = [];
let lastSize = 0;
let containerColors;
let containerSizes;
let productSelect;
let productSelectOptions;
let listImg;

window.onload = function(e){
    initVariables();
    if (containerSizes && containerColors) {
        createColorsArray();
        createDataObject();
        Object.keys(data).forEach(function (item) {
            containerColors.innerHTML += ('<li>' + item + '</li>');
        });
        for (let color of containerColors.querySelectorAll('li')) {
            color.addEventListener('click', () => {
                switchColor(color)
            })
        }
        verifyIfEmptyColor();
        switchColor( getFirstColorAvailable() );
    }
};

function getFirstColorAvailable() {
    let actualColor = 0;
    let colorAvailable = false;
    while(!colorAvailable) {
        if( containerColors.querySelectorAll('li')[actualColor].classList.contains('disabled') ) {
            actualColor += 1;
        } else {
            colorAvailable = containerColors.querySelectorAll('li')[actualColor];
        }
    }
    return colorAvailable;
}

function createColorsArray() {
    for (let variant of productSelectOptions) {
        const variantColor = variant.getAttribute('data-color');
        if (!colors.includes(variantColor)) {
            colors.push(variantColor)
        }
    }
}

function createDataObject() {
    for(let i = 0; i<colors.length; i++) {
        data[colors[i]] = {};
        data[colors[i]].products = {};
        data[colors[i]].images = [];
        for (let img of listImg) {
            if(img.getAttribute('data-color') === colors[i]) {
                data[colors[i]].images.push(img);
            }
        }
        for (let y = 0; y<productSelectOptions.length; y++) {
            if (colors[i] === productSelectOptions[y].getAttribute('data-color')) {
                data[colors[i]].products[y] = {};
                data[colors[i]].products[y].size = productSelectOptions[y].getAttribute('data-size');
                data[colors[i]].products[y].value = productSelectOptions[y].getAttribute('value');
                data[colors[i]].products[y].disabled = productSelectOptions[y].getAttribute('disabled');
            }
        }
    }
}

function verifyIfEmptyColor() {
    Object.keys(data).forEach(function (color) {
        let isAvailable = 0;
        Object.keys(data[color].products).forEach( (item) => {
            if(!data[color].products[item].disabled) {
                isAvailable += 1;
            }
        });
        if(isAvailable === 0) {
            for(let child of containerColors.querySelectorAll('li')) {
                if (child.innerHTML === color) {
                    child.classList.add('disabled');
                }
            }
        }
    });
}

function switchColor(option) {
    updateActive(option, containerColors.querySelectorAll('li'));
    updateSizeList(option);
    let newSize = getFirstSizeAvailable();
    // check if a size has already been selected and is available
    if(lastSize !== 0) {
        for (let item of containerSizes.querySelectorAll('li')) {
            if (item.innerHTML === lastSize && !item.classList.contains('disabled')) {
                newSize = item;
            }
        }
    }
    updateSelectedProduct(newSize);
    initSizeClick(containerSizes.querySelectorAll('li'));
    updateImages(option.innerHTML);
}

function updateSizeList(option) {
    var color = option.innerHTML;
    containerSizes.innerHTML = '';
    Object.keys(data[color].products).forEach(function (item) {
        let newClass = '';
        if (data[color].products[item].disabled === "disabled") {
            newClass = "disabled";
        }
        containerSizes.innerHTML += '<li class="'+ newClass +'" data-value="' + data[color].products[item].value +'">' + data[color].products[item].size + '</li>'
    });
}

function getFirstSizeAvailable() {
    let newSize = false;
    let listSizes = containerSizes.querySelectorAll('li');
    let actualSizeItem = 0;
    while (!newSize) {
        if(listSizes[actualSizeItem].classList.contains('disabled')) {
            actualSizeItem += 1;
        } else {
            newSize = listSizes[actualSizeItem];
        }
    }
    return newSize;
}

function updateSelectedProduct(sizeLi) {
    updateActive(sizeLi, containerSizes.querySelectorAll('li'));
    var value = sizeLi.getAttribute('data-value');
    for (let option of productSelectOptions) {
        if (value === option.getAttribute('value')) {
            option.selected = true;
        }
    }
}

function initSizeClick(list) {
    for (let li of list) {
        li.addEventListener('click', () => {
            updateSelectedProduct(li);
            lastSize = li.innerHTML;
        });
    }
}

function updateActive(item, list) {
    for (let li of list) {
        li.classList.remove('active');
    }
    item.classList.add('active');
}

function updateImages(color) {
    for(let img of listImg) {
        img.classList.add('d-none');
    }
    Object.keys(data[color].images).forEach(function (item) {
        data[color].images[item].classList.remove('d-none');
    });
}

function initVariables() {
    containerColors = document.querySelector('.container_option1');
    containerSizes = document.querySelector('.container_option2');
    productSelect = document.querySelectorAll('#product-select');
    productSelectOptions = document.querySelectorAll('#product-select option');
    listImg = document.querySelectorAll('.product-img');
}