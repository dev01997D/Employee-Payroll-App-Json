let isUpdate = false;
let employeePayrollObj = {};

window.addEventListener("DOMContentLoaded", (event) => {
    const name = document.querySelector("#name");
    name.addEventListener("input", function () {
        if (name.value.length == 0) {
            setTextValue('.text-error', "");
            return;
        }
        try {
            checkName(name.value);
            setTextValue('.text-error', "");
        } catch (e) {
            setTextValue('.text-error', e);
        }
    });

    const salary = document.querySelector("#salary");
    const output = document.querySelector(".salary-output");
    salary.addEventListener("input", function () {
        output.textContent = salary.value;
    });

    const startdate = document.querySelector("#startDate");
    startdate.addEventListener("input", function () {
        let date = new Date(Date.parse(getInputValueById('#month') + " " + getInputValueById('#day') + " " + getInputValueById('#year')));
        try {
            checkStartDate(new Date(Date.parse(date)));
            setTextValue('.date-error', "");
        } catch (e) {
            setTextValue('.date-error', e);
        }
    });

    checkForUpdate();
});

const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        //Do the save operations accroding to requirement
        if (site_properties.use_local_storage.match("true")) {
            setEmployeePayrollObject();
            createAndUpdateStorage();
            resetForm();
            window.location.replace(site_properties.home_page);
        }
        //for client-server architecture
        else {
            createOrUpdateEmployeePayroll();
        }
    } catch (e) {
        return;
    }
}

//Do operations like post or put depending on requirement
createOrUpdateEmployeePayroll = () => {
    let postURL = site_properties.server_url;
    let methodCall = "POST";
    if (isUpdate) {
        methodCall = "PUT";
        postURL = postURL + employeePayrollObj.id.toString();
    }

    makeServiceCall(methodCall, postURL, true, employeePayrollObj)
        .then(responseText => {
            resetForm();
            window.location.replace(site_properties.home_page);
        })
        .catch(error => {
            throw error;
        });
}

function createAndUpdateStorage() {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList == null) {
        employeePayrollList = [];
    }
    if (employeePayrollList) {
        let empPayrollData = employeePayrollList.find(empData => empData.id == employeePayrollObj.id);
        if (!empPayrollData) {
            employeePayrollList.push(employeePayrollObj);
        } else {
            const index = employeePayrollList.map(empData => empData.id).indexOf(empPayrollData.id);
            employeePayrollList.splice(index, 1, employeePayrollObj);
        }
    } else {
        employeePayrollList = [employeePayrollObj];
    }
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID) + 1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
}

const setEmployeePayrollObject = () => {
    if (!isUpdate) {
        employeePayrollObj.id = createNewEmployeeId();
    }
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    let date = getInputValueById('#month') + " " + getInputValueById('#day') + " " + getInputValueById('#year');
    employeePayrollObj._startDate = new Date(date);
    employeePayrollObj._notes = getInputValueById('#notes');
}

const resetForm = () => {
    setValue('#name', '');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary', '');
    setTextValue('.salary-output', getInputValueById('#salary'));
    setValue('#notes', '');
    setValue('#day', '0');
    setValue('#month', '0');
    setValue('#year', '0');
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach(item => {
        if (item.checked)
            selItems.push(item.value);
    });
    return selItems;
}

const checkForUpdate = () => {
    const employeePayrollJSON = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJSON ? true : false;
    if (!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJSON);
    setForm();
}

const setForm = () => {
    setValue('#name', employeePayrollObj._name);
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes', employeePayrollObj._notes);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

const stringifyDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const newDate = !date ? "undefined" : new Date(Date.parse(date)).toLocaleDateString('en-IN', options);
    return newDate;
}

const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        } else if (item.value === value) item.checked = true;
    });
}

let site_properties = {
    home_page: "../pages/new_home.html",
    add_emp_payroll_page: "../pages/new_payroll_form.html"
};

const checkName = (name) => {
    let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
    if (!nameRegex.test(name)) throw 'Name is incorrect';
}

const checkStartDate = (startDate) => {
    let now = new Date();
    if (startDate > now) throw 'Start date is a future date';
    var diff = Math.abs(now.getTime() - startDate.getTime());
    if (diff / (1000 * 60 * 60 * 24) > 30) throw 'Start Date is beyond 30 Days';
}