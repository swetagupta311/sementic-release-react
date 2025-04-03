import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useEffect } from 'react';
import flatpickr from 'flatpickr';
import { useFormik } from 'formik';
import { validationSchema } from './validationSchema';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import api from '../../api/apiService.js';
const AddEmployee = () => {
  useEffect(() => {
    // Init flatpickr
    flatpickr('.form-datepicker', {
      mode: 'single',
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'M j, Y',
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    });
  }, []);

  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [storeRoles,setRoles]=useState();

  const initialValues = {
    firstname: '',
    lastname: '',
    dob: '',
    email: '',
    phone: '',
    aadharphoto: '',
    cfourphoto: '',
    role: '',
    state: '',
    city: '',
    cfourvalidation: 0,
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
    validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
      AddEmployee(values);
    },
  });

  //getting the roles 
  useEffect(()=>{
    getRoles();
  },[])


  const getRoles=async()=>{
    try{
     const response=await api.get("/roles");
     setRoles(response.data);
    }
    catch(e){
        console.log("");
        
    }
  }

  //post API for adding employee
  const AddEmployee = async (values) => {
    setLoading(true);
    const loadingToast = toast.loading('Adding Employee...', {
      theme: 'colored',
      closeOnClick: true,
    });

    try {
      const formData = new FormData();
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

      const response = await api.post('/adduser', formData);

      if (response.status === 201) {
        resetForm();
        setLoading(false);
        toast.update(loadingToast, {
          render: 'Employee added successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          theme: 'colored',
          closeOnClick: true,
        });
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

      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      setFieldValue("aadharphoto", file); 

    }
  };
  
  
  return (
    <>
      <Breadcrumb pageName="Add Employee" />
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add employee
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    First name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="firstname"
                    value={values.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[0-9]/g, ''))
                    }
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.firstname && errors.firstname ? (
                    <p className="errormsg">{errors.firstname}</p>
                  ) : null}
                  <div></div>
                </div>

                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Last name
                  </label>
                  <input
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[0-9]/g, ''))
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
                    <p className="errormsg">{errors.lastname}</p>
                  ) : null}
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email 
                  </label>
                  <input
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

                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone Number <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Enter your Phone Number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    maxLength={10}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                  />
                  {touched.phone && errors.phone ? (
                    <p className="errormsg">{errors.phone}</p>
                  ) : null}
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
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
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select your Role
                      </option>
                      {storeRoles?storeRoles.map((item,key)=>(
                          <option
                          value={item.slug}
                          className="text-body dark:text-bodydark"
                          key={key}
                        >
                         {item.name}
                        </option>
                      )):null}
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
                    Date of Birth <span className="text-meta-1">*</span>
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

              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
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
                        isOptionSelected ? 'text-black dark:text-white' : ''
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

                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    City<span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[0-9]/g, ''))
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
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    C4 Validation <span className="text-meta-1">*</span>
                  </label>
                  <div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="cfourvalidation"
                          value="1"
                          checked={values.cfourvalidation === '1'}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="hidden"
                        />
                        <span className="w-5 h-5 inline-block border-2 border-gray-400 rounded-full flex items-center justify-center">
                          {values.cfourvalidation === '1' && (
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
                          checked={values.cfourvalidation === '0'}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="hidden"
                        />
                        <span className="w-5 h-5 inline-block border-2 border-gray-400 rounded-full flex items-center justify-center">
                          {values.cfourvalidation === '0' && (
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          )}
                        </span>
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <label className="mb-3 block text-black dark:text-white">
                    Upload Aadhaar
                  </label>
                  <input
                    name="aadharphoto"
                    onBlur={handleBlur}
                    onChange={handleFileChange}
                    type="file"
                    accept="image/png, image/gif, image/jpeg, image/jpg"
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  />
                  {touched.aadharphoto && errors.aadharphoto ? (
                    <p className="errormsg">{errors.aadharphoto}</p>
                  ) : null}
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 x:flex-row">
                <div className="w-full lg:w-1/2">
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
                    <p className="errormsg">{errors.cfourphoto}</p>
                  ) : null}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex  justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Add Employee
              </button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default AddEmployee;
