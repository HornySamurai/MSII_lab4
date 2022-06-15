'use strict';
//#region variables 
const minX        = document.querySelector('#minX');
const maxX        = document.querySelector('#maxX');
const accrBox     = document.querySelector('#accrBox');
const popSize     = document.querySelector('#popSize');
const textBox1    = document.querySelector('#textBox1');
const textBox2    = document.querySelector('#textBox2');
const button1     = document.querySelector('.button1');
const button2     = document.querySelector('.button2');
const button3     = document.querySelector('.button3');
const table       = document.querySelector('.table');
const tablebody   = document.querySelector('.dataGrid');
const label1      = document.querySelector('.label1');
const label2      = document.querySelector('.label2');
//#endregion

minX.max = parseInt(maxX.value) - 1;
maxX.onchange = () => {
    minX.max = parseInt(maxX.value) - 1;
    if(parseInt(maxX.value) <= parseInt(minX.value))
        minX.value = parseInt(maxX.value) - 1;  
}

let xMin, xMax, accuracy, 
    roundNum, n, maxIter, 
    mutationChance, chromSize, currIter;
const population = [];

const randint = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const f = (x) => {
    return (6 * x ** 3) + (2 * x ** 2) + 54;
}

const convertChromosome = (chromosome) => {
    return parseFloat(xMin) + parseInt(chromosome, 2) * accuracy;
}

const createPopulation = (size) => {
    population.length = 0
    let code, x, y;
    for(let i = 0; i < size; ++i){
        code = ''
        for(let j = 0; j < chromSize; ++j){
            code += Math.round(Math.random());
        }
        x = convertChromosome(code);
        y = f(x);
        population.push({
            'code': code,
            'x' : x,
            'y': y
        });
    }
}

const chooseParent = () => {
    let summ = 0;
    for(let i = 1; i <= population.length; ++i) summ++;
    let num = 0, ch = Math.random();
    for(let i = 0; i < population.length; i++){
        num += parseFloat((population.length - 1) / summ);
        if(ch <= num) return i;
    }
    return 0;
}

const evolution = () => {
    try {
        let parent1, parent2, child1, child2, crossPoint;
        let size = parseInt((population.length / 2) - ((population.length / 2) % 2));
        for(let i = 0; i < size; i++)
            population.pop();
        let obj1, obj2;
        for(let i = 0; i < size / 2; i++){
            crossPoint = randint(1, chromSize - 1);
            parent1 = chooseParent();
            parent2 = chooseParent();
            
            obj1 = Array.from(population[parent1].code.slice(0, crossPoint) + population[parent2].code.slice(crossPoint))
            obj2 = Array.from(population[parent2].code.slice(0, crossPoint) + population[parent1].code.slice(crossPoint))

            for(let j = 0; j < chromSize; j++){
                if(Math.random() < mutationChance)
                    obj1[j] = obj1[j] == '0' ? '1' : '0';
                if(Math.random() < mutationChance)
                    obj1[j] = obj1[j] == '0' ? '1' : '0';
            }
            child1 = obj1.join('');
            child2 = obj2.join('');
            population.push({
                code: child1,
                x: convertChromosome(child1),
                y: f(convertChromosome(child1))
            });
            population.push({
                code: child2,
                x: convertChromosome(child2),
                y: f(convertChromosome(child2))
            });
        }
    } catch (ex) {
        console.log(ex);
    }
}

const clearTable = () => {
    if(tablebody.rows.length == 0) return;
    do{    
        tablebody.deleteRow(0);
    } while(tablebody.rows.length > 0);
}

const updateTable = () => {
    clearTable();
    let newrow;
    for(let i = 0; i < population.length; i++){
        newrow = tablebody.insertRow(-1);
        newrow.insertCell(0).innerHTML = i + 1;
        newrow.insertCell(1).innerHTML = population[i].code;
        newrow.insertCell(2).innerHTML = population[i].x;
        newrow.insertCell(3).innerHTML = population[i].y;
    }
}

button1.onclick = () => {
    clearTable();
    xMin = parseInt(minX.value);
    xMax = parseInt(maxX.value);
    roundNum = parseInt(accrBox.value);
    n = parseInt(popSize.value);
    mutationChance = parseFloat(textBox1.value);
    let R = parseFloat(xMax - xMin);
    let dN = parseInt(R / (10 ** -roundNum));
    chromSize = parseInt(Math.ceil(Math.log2(dN)));
    label1.innerText = `Размер хромосомы: ${chromSize}`;
    accuracy = parseFloat(R / (2 ** chromSize));
    currIter = 0;
    label2.innerText = 'Итерация #';
    button2.disabled = false;
    button3.disabled = false;

    createPopulation(n);
    updateTable();
}

button2.onclick = () => {
    currIter++;
    label2.innerHTML = `Итерация #${currIter}`;
    population.sort((a, b) => a.y > b.y ? 1 : -1);
    evolution();
    population.sort((a, b) => a.y > b.y ? 1 : -1);
    updateTable();
}

button3.onclick = () => {
    maxIter = parseInt(textBox2.value);
    currIter += maxIter;
    label2.innerHTML = `Итерация #${currIter}`;
    for (let i = 0; i < maxIter; i++) {
        population.sort((a, b) => a.y > b.y ? 1 : -1);
        evolution();
        population.sort((a, b) => a.y > b.y ? 1 : -1);
    }
    updateTable();
}


// console.log(parseInt('abba'.match(/\d+/)));