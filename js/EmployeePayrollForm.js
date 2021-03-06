//UC2: Validating name and adding eventlistener for salary
window.addEventListener('DOMContentLoaded', (event) => {
    const name = document.querySelector("#name");
    const textError = document.querySelector(".text-error");
    name.addEventListener("input", function () {
        if (name.value.length == 0) {
            textError.textContent = "";
            return;
        }
        try {
            (new EmployeePayrollData()).name = name.value;
            textError.textContent = "";
        } catch (e) {
            textError.textContent = e;
        }
    });

    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-error');
    salary.addEventListener('input', function () {
        output.textContent = salary.value;
    });

    const startdate = document.querySelector("#startDate");
    const dateError = document.querySelector(".date-error");
    startdate.addEventListener("input", function() {
        let date = new Date(Date.parse(getInputValueById('#month') + " " + getInputValueById('#day') + " " + getInputValueById('#year')));
        try {
            (new EmployeePayrollData()).startDate = date;
            dateError.textContent="";
        } catch (e) {
            dateError.textContent;
        }
    });

});

const save = () => {
    try {
        let empPayrollData = createEmployeePayroll();
        alert(empPayrollData.toString());
        createAndUpdateStorage(empPayrollData);
    }
    catch (e) {
        return;
    }
}

//UC4: Storing in local storage
function createAndUpdateStorage(employeePayrollData) {
    //localStorage.clear(); //this can be used to clear all records from localStorage
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    alert(employeePayrollData);
    if (employeePayrollList != undefined) {
        employeePayrollList.push(employeePayrollData);
    }
    else {
        employeePayrollList = [employeePayrollData];
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

//UC3: Create Employee payroll object
const createEmployeePayroll = () => {
    let employeePayrollData = new EmployeePayrollData();
    employeePayrollData.id = createNewEmployeeId();
   try {
        employeePayrollData.name = getInputValueById('#name');
    }
    catch (e) {
        setTextValue('.text-error', e);
        throw e;
    }
    // Use of helper function
    employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData.department = getSelectedValues('[name=department]');
    employeePayrollData.salary = getInputValueById('#salary');
    employeePayrollData.notes = getInputValueById('#notes');
    let date = getInputValueById('#month') + " " + getInputValueById('#day') + " " + getInputValueById('#year');
    employeePayrollData.startDate = new Date(date);
    return employeePayrollData;
}

//Generating employee id for all objects
const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID) + 1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const getSelectedValues = (propertValue) => {
    let allItems = document.querySelectorAll(propertValue);
    let selectedItems = [];
    allItems.forEach(items => {
        if (items.checked) selectedItems.push(items.value);
    });
    return selectedItems;
}