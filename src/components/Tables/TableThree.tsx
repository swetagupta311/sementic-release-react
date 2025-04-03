import { Package } from '../../types/package';
import { TiEdit } from 'react-icons/ti';
import { useState, useEffect } from 'react';
import Editemployee from '../../pages/Employee/Editemployee';
import { ToastContainer, toast } from 'react-toastify';
const TableThree = (props) => {
  const [editpopup, setEditpopup] = useState(false);
  const [employeeid, setEmployeeId] = useState();
  const [toaststatusEmployee, setToaststatusEmployee] = useState(false);
  useEffect(() => {
    toaststatusEmployee &&
      toast.success('Employee updated Successfully', {
        autoClose: 3000,
        theme: 'colored',
        closeOnClick: true,
      });
    setTimeout(() => {
      setToaststatusEmployee(false);
    }, 3000);
  }, [toaststatusEmployee]);
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = props.employeeData.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-500 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                First Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Last Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Employee Code
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                DOB
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                City
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Role
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                State
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-5">
                  No records found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((item, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {item.firstname}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {item.lastname}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {item.user_code}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{item.dob}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{item.city}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{item.role}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{item.state}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <TiEdit
                          onClick={() => {
                            setEditpopup(true);
                            setEmployeeId(item.id);
                          }}
                        />
                      </button>
                      <button className="hover:text-primary">
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* SVG path goes here */}
                        </svg>
                      </button>
                      <button className="hover:text-primary">
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* SVG path goes here */}
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {toaststatusEmployee ? <ToastContainer /> : null}
        {editpopup && (
          <Editemployee
            setEditpopup={setEditpopup}
            setEmployeeId={setEmployeeId}
            editpopup={editpopup}
            employeeid={employeeid}
            getEmployee={props.getEmployee}
            setToaststatusEmployee={setToaststatusEmployee}
            toaststatusEmployee={toaststatusEmployee}
          />
        )}
      </div>
    </div>
  );
};

export default TableThree;
