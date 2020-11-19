window.addEventListener('DOMContentLoaded', (event) => {
    createInnerHtml();
});

const createInnerHtml = () => {
    const innerHtml = `
    <tr>
            <th></th>
            <th>Name</th>
            <th>Gender</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Start Date</th>
            <th>Actions</th>
        </tr>
        <tr>
            <td><img class="profile" alt="sample photo" src="../assets/Ellipse -5.png" alt=""></td>
            <td>Devnandan Kumar</td>
            <td>Male</td>
            <td>
                <div class="dept-table">Engineer</div>
                <div class="dept-table">Finance</div>
            </td>
            <td>400000</td>
            <td>16 Sept 2020</td>
            <td><img id="1" onclick="remove(this)" alt="delete" src="../assets/delete-black-18dp.svg">
                <img id="1" onclick="update(this)" alt="edit" src="../assets/create-black-18dp.svg"></td>
        </tr>
`;
    document.querySelector('#table-display').innerHTML = innerHtml;
}