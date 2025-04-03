import React, { useEffect, useState } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { MdEditSquare } from 'react-icons/md';
import { validationSchemaEdit } from './validationSchemaEdit';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import api from '../../api/apiService.js';
const Editemployee = (props) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [EmployeeByid, setEmployeeByid] = useState();
  const [loaderforfetching, setLoaderforfetching] = useState(false);
  const [loaderforupdating, setLoaderforupdating] = useState(false);
  const [storeRoles, setRoles] = useState();
  const initialValues = {
    firstname: '',
    lastname: '',
    dob: null,
    email: '',
    phone: '',
    aadharphoto: '',
    role: '',
    state: '',
    city: '',
    cfourvalidation: '',
    cfourphoto: '',
  };
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: validationSchemaEdit,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
      editEmployee(values);
    },
  });
  //getting signle employee
  useEffect(() => {
    getEmployeeById();
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(response.data);
    } catch (e) {
      console.log('');
    }
  };

  //to get employee by id
  const getEmployeeById = async () => {
    setLoaderforfetching(true);
    try {
      const response = await api.get('/getUsers');

      if (response.status === 200) {
        const filteredData = response.data.filter(
          (item) => item.id == props.employeeid,
        );

        if (filteredData.length > 0) {
          const employee = filteredData[0];
          setEmployeeByid(employee.id);
          setFieldValue('firstname', employee.firstname);
          setFieldValue('lastname', employee.lastname);
          setFieldValue('dob', employee.dob);
          setFieldValue('email', employee.email);
          setFieldValue('phone', employee.phone);
          setFieldValue('aadharphoto', employee.aadharphoto);
          setFieldValue('role', employee.role);
          setFieldValue('state', employee.state);
          setFieldValue('city', employee.city);
          setFieldValue('cfourvalidation', employee.c4_validation);
        }
      }
    } catch (err) {
      console.error('Error fetching employee data:', err);
    } finally {
      setLoaderforfetching(false);
    }
  };

  //put api to edit employee
  const editEmployee = async (values) => {
    setLoaderforupdating(true);
    const loadingToast = toast.loading('Updating Employee...', {
      theme: 'colored',
      closeOnClick: true,
    });

    try {
      const formData = new FormData();
      formData.append('user_id', EmployeeByid);
      formData.append('firstname', values.firstname);
      formData.append('lastname', values.lastname);
      formData.append('dob', values.dob);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('c4_validation', values.cfourvalidation);
      formData.append('role', values.role);
      formData.append('state', values.state);
      formData.append('city', values.city);
      formData.append('aadhar_photo', values.aadharphoto);
      formData.append('cfourphoto', values.c4_photo);

      const response = await api.put('/updateProfile', formData);

      if (response.status === 200) {
        setFieldValue('dob', 'mm/dd/yy');
        setFieldValue('cfourvalidation', '');
        props.setEditpopup(false);
        props.setToaststatusEmployee(!props.toaststatusEmployee);
        resetForm();

        toast.update(loadingToast, {
          render: 'Employee updated successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          theme: 'colored',
          closeOnClick: true,
        });
        props.getEmployee();
      }
    } catch (err) {
      toast.update(loadingToast, {
        render:
          err.response?.data?.error ||
          (Array.isArray(err.response?.data?.errors)
            ? err.response.data.errors[0]?.msg
            : 'Something went wrong'),
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        theme: 'colored',

        closeOnClick: true,
      });
    } finally {
      setLoaderforupdating(false);
    }
  };

  return (
    <div>
      <div
        className="relative z-999"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform  rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[47rem]">
              <button
                className="float-right mr-4"
                onClick={() => props.setEditpopup(!props.editpopup)}
              >
                <ImCancelCircle className="h-12 w-[23px]" />
              </button>
              <div className="bg-white px-2 pt-3 pb-2 sm:p-4 sm:pb-2 rounded-lg">
                <div className="sm:items-start">
                  {loaderforfetching ? (
                    <div className="flex flex-col justify-center items-center h-full">
                      {' '}
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-14 h-12 text-[#3c50e0] animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        ></path>
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      <p className="mt-4">Loading....</p>{' '}
                    </div>
                  ) : (
                    <>
                      {' '}
                      <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
                        <MdEditSquare className="h-12 w-[23px]" />
                      </div>
                      <div className="mt-3  sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="font-semibold text-gray-900 text-2xl mt-4"
                          id="modal-title"
                        >
                          Edit Employee
                        </h3>

                        <div className="mt-2">
                          <form onSubmit={handleSubmit}>
                            <div className="">
                              <div className="mb-4.5 flex flex-col lg:flex-row gap-6 ">
                                <div className="lg:w-1/2 w-full">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    First name{' '}
                                    <span className="text-meta-1">*</span>
                                  </label>
                                  <input
                                    name="firstname"
                                    value={values.firstname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onInput={(e) =>
                                      (e.target.value = e.target.value.replace(
                                        /[0-9]/g,
                                        '',
                                      ))
                                    }
                                    type="text"
                                    placeholder="Enter your first name"
                                    className="w-full  border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary rounded-lg"
                                  />
                                  {touched.firstname && errors.firstname ? (
                                    <p className="errormsg">
                                      {errors.firstname}
                                    </p>
                                  ) : null}
                                  <div></div>
                                </div>

                                <div className="lg:w-1/2 w-full ">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Last name{' '}
                                 
                                  </label>
                                  <input
                                    onInput={(e) =>
                                      (e.target.value = e.target.value.replace(
                                        /[0-9]/g,
                                        '',
                                      ))
                                    }
                                    name="lastname"
                                    value={values.lastname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="text"
                                    placeholder="Enter your last name"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                  />
                                  {touched.lastname && errors.lastname ? (
                                    <p className="errormsg">
                                      {errors.lastname}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                              <div className="mb-4.5 flex flex-col lg:flex-row gap-6 ">
                                <div className="lg:w-1/2 w-full">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Email
                                  </label>
                                  <input
                                    disabled
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                  />
                                  {touched.email && errors.email ? (
                                    <p className="errormsg">{errors.email}</p>
                                  ) : null}
                                </div>

                                <div className="lg:w-1/2 w-full">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Phone Number{' '}
                                    <span className="text-meta-1">*</span>
                                  </label>
                                  <input
                                   
                                    name="phone"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="text"
                                    placeholder="Enter your Phone Number"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^0-9]/g,
                                        '',
                                      );
                                    }}
                                  />
                                  {touched.phone && errors.phone ? (
                                    <p className="errormsg">{errors.phone}</p>
                                  ) : null}
                                </div>
                              </div>
                              <div className="mb-4.5 flex flex-col lg:flex-row gap-6">
                                <div className="w-full lg:w-1/2">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Role <span className="text-meta-1">*</span>
                                  </label>
                                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                      name="role"
                                      value={values.role}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      disabled
                                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                                        isOptionSelected
                                          ? 'text-black dark:text-white'
                                          : ''
                                      }`}
                                    >
                                      <option
                                        value=""
                                        disabled
                                        className="text-body dark:text-bodydark"
                                      >
                                        Select your Role
                                      </option>
                                      {storeRoles
                                        ? storeRoles.map((item, key) => (
                                            <option
                                              value={item.slug}
                                              className="text-body dark:text-bodydark"
                                              key={key}
                                            >
                                              {item.name}
                                            </option>
                                          ))
                                        : null}
                                    </select>

                                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                      <svg
                                        className="fill-current"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g opacity="0.8">
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                            fill=""
                                          ></path>
                                        </g>
                                      </svg>
                                    </span>
                                    {touched.role && errors.role ? (
                                      <p className="errormsg">{errors.role}</p>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="w-full lg:w-1/2">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Date of Birth{' '}
                                    <span className="text-meta-1">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    name="dob"
                                    value={values.dob}
                                    onChange={handleChange}
                                    max={dayjs().format('YYYY-MM-DD')}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                  />
                                  {touched.dob && errors.dob ? (
                                    <p className="errormsg">{errors.dob}</p>
                                  ) : null}
                                </div>
                              </div>

                              <div className="mb-4.5 flex flex-col lg:flex-row gap-6 ">
                                <div className="w-full ">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    State <span className="text-meta-1">*</span>
                                  </label>
                                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                      name="state"
                                      value={values.state}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                                        isOptionSelected
                                          ? 'text-black dark:text-white'
                                          : ''
                                      }`}
                                    >
                                      <option
                                        value=""
                                        disabled
                                        className="text-body dark:text-bodydark"
                                      >
                                        Select State
                                      </option>
                                      <option
                                        value="Andhra Pradesh"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Andhra Pradesh
                                      </option>
                                      <option
                                        value="Arunachal Pradesh"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Arunachal Pradesh
                                      </option>
                                      <option
                                        value="Assam"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Assam
                                      </option>
                                      <option
                                        value="Bihar"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Bihar
                                      </option>
                                      <option
                                        value="Delhi"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Delhi
                                      </option>
                                      <option
                                        value="Chhattisgarh"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Chhattisgarh
                                      </option>
                                      <option
                                        value="Goa"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Goa
                                      </option>
                                      <option
                                        value="Gujarat"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Gujarat
                                      </option>
                                      <option
                                        value="Haryana"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Haryana
                                      </option>
                                      <option
                                        value="Himachal Pradesh"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Himachal Pradesh
                                      </option>
                                      <option
                                        value="Jharkhand"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Jharkhand
                                      </option>
                                      <option
                                        value="Karnataka"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Karnataka
                                      </option>
                                      <option
                                        value="Kerala"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Kerala
                                      </option>
                                      <option
                                        value="Madhya Pradesh"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Madhya Pradesh
                                      </option>
                                      <option
                                        value="Maharashtra"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Maharashtra
                                      </option>
                                      <option
                                        value="Manipur"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Manipur
                                      </option>
                                      <option
                                        value="Meghalaya"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Meghalaya
                                      </option>
                                      <option
                                        value="Mizoram"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Mizoram
                                      </option>
                                      <option
                                        value="Nagaland"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Nagaland
                                      </option>
                                      <option
                                        value="Odisha"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Odisha
                                      </option>
                                      <option
                                        value="Punjab"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Punjab
                                      </option>
                                      <option
                                        value="Rajasthan"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Rajasthan
                                      </option>
                                      <option
                                        value="Sikkim"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Sikkim
                                      </option>
                                      <option
                                        value="Tamil Nadu"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Tamil Nadu
                                      </option>
                                      <option
                                        value="Telangana"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Telangana
                                      </option>
                                      <option
                                        value="Tripura"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Tripura
                                      </option>
                                      <option
                                        value="Uttar Pradesh"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Uttar Pradesh
                                      </option>
                                      <option
                                        value="Uttarakhand"
                                        className="text-body dark:text-bodydark"
                                      >
                                        Uttarakhand
                                      </option>
                                      <option
                                        value="West Bengal"
                                        className="text-body dark:text-bodydark"
                                      >
                                        West Bengal
                                      </option>
                                    </select>

                                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                      <svg
                                        className="fill-current"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g opacity="0.8">
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                            fill=""
                                          ></path>
                                        </g>
                                      </svg>
                                    </span>
                                    {touched.state && errors.state ? (
                                      <p className="errormsg">{errors.state}</p>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="w-full ">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    City<span className="text-meta-1">*</span>
                                  </label>
                                  <input
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onInput={(e) =>
                                      (e.target.value = e.target.value.replace(
                                        /[0-9]/g,
                                        '',
                                      ))
                                    }
                                    type="text"
                                    placeholder="Enter city"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                  />
                                  {touched.city && errors.city ? (
                                    <p className="errormsg">{errors.city}</p>
                                  ) : null}
                                  <div></div>
                                </div>
                              </div>
                              <div className="mb-4.5 flex flex-col gap-6">
                                <div className="w-full">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    C4 Validation{' '}
                                    <span className="text-meta-1">*</span>
                                  </label>
                                  <div>
                                    <div className="flex items-center space-x-4">
                                      <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                          type="radio"
                                          name="cfourvalidation"
                                          value="1"
                                          checked={
                                            values.cfourvalidation == '1'
                                          } // Ensure it matches as a string
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          className="hidden"
                                        />
                                        <span className="w-5 h-5 inline-block border-2 border-gray-400 rounded-full flex items-center justify-center">
                                          {values.cfourvalidation == 1 && (
                                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                          )}
                                        </span>
                                        <span>Yes</span>
                                      </label>

                                      <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                          type="radio"
                                          name="cfourvalidation"
                                          value="0"
                                          checked={
                                            values.cfourvalidation == '0'
                                          } // Ensure it matches as a string
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          className="hidden"
                                        />
                                        <span className="w-5 h-5 inline-block border-2 border-gray-400 rounded-full flex items-center justify-center">
                                          {values.cfourvalidation == 0 && (
                                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                          )}
                                        </span>
                                        <span>No</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {/* <div className="w-full">
                                  <label className="mb-3 block text-black dark:text-white">
                                    Upload Aadhaar{' '}
                                   
                                  </label>
                                  <input
                                    name="aadharphoto"
                                    value={values.aadharphoto}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                  />
                                  {touched.aadharphoto && errors.aadharphoto ? (
                                    <p className="errormsg">
                                      {errors.aadharphoto}
                                    </p>
                                  ) : null}
                                </div> */}
                              </div>
                              {/* 
                              <div className="mb-4.5 flex flex-col gap-6 ">
                                <div className="w-full ">
                                  <label className="mb-3 block text-black dark:text-white">
                                    Upload C4 photo
                                  </label>
                                  <input
                                    name="cfourphoto"
                                    value={values.cfourphoto}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                  />
                                  {touched.cfourphoto && errors.cfourphoto ? (
                                    <p className="errormsg">
                                      {errors.cfourphoto}
                                    </p>
                                  ) : null}
                                </div>
                              </div> */}
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-300 sm:ml-3 sm:w-auto"
                                disabled={loaderforupdating}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() =>
                                  props.setEditpopup(!props.editpopup)
                                }
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />{' '}
    </div>
  );
};

export default Editemployee;
