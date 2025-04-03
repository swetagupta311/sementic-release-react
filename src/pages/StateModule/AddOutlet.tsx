import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { validationSchemaoutlet } from './validationSchemaoutlet';
import { TiEdit } from 'react-icons/ti';
import EditOutlet from './EditOutlet';
import api from '../../api/apiService.js';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
const AddOutlet = () => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [editPopup, setEditpopup] = useState(false);
  const [outletId, setOutletId] = useState();
  const [cityData, setCityData] = useState([]);
  //for determining post api sucess
  const [loading, setLoading] = useState(false);
  const [toastOutletStatus, setToastOutletStatus] = useState(false);

  //for storing the outlet data
  const [outletData, setOutletData] = useState([]);
  const initialValues = {
    name: '',
    latitude: '',
    longitude: '',
    city: 0,
    outlet_address: '',
    outlet_area: '',
    outlet_code: '',
    testingoutlet: 0,
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
    validationSchema: validationSchemaoutlet,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
      AddOutlet(values);
    },
  });

  //calling function to view outlet, city data
  useEffect(() => {
    ViewOutlet();
    ViewCity();
  }, []);
  //get API for viewing outlet
  const ViewOutlet = async () => {
    try {
      const response = await api.get('/getoutlets');
      if (response.status === 200) {
        setOutletData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //get API for listing city in dropdown
  const ViewCity = async () => {
    try {
      const response = await api.get('/getcities');
      if (response.status === 200) {
        setCityData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //post API for adding outlet
  const AddOutlet = async (values) => {
    setLoading(true);
    const loadingToast = toast.loading('Adding Outlet...', {
      theme: 'colored',
      closeOnClick: true,
    });

    try {
      const response = await api.post('/addoutlet', {
        outlet_name: values.name,
        outlet_code: values.outlet_code.toUpperCase(),
        outlet_address: values.outlet_address,
        outlet_area: values.outlet_area,
        outlet_latitude: values.latitude,
        outlet_longitude: values.longitude,
        city_id: values.city,
        isTestingOutlet: values.testingoutlet,
      });
      if (response.status === 201) {
        ViewOutlet();
        resetForm();
        setLoading(false);
        toast.update(loadingToast, {
          render: 'Outlet added successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          theme: 'colored',
          closeOnClick: true,
        });
      }
    } catch (err) {
      console.log(err.response.data.error);
      console.log(err);
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
      setLoading(false);
    }
  };
  //API for deleting the city
  const deleteOutlet = (id) => {
    Swal.fire({
      title: 'Do you want to delete the outelt',
      showDenyButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: `Cancel`,
      icon: 'warning',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'swalconfirmButton',
        denyButton: 'swaldenyButton',
        cancelButton: 'custom-swal-cancel',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/deleteoutlet/${id}`);
          if (response.status === 200) {
            Swal.fire('Deleted!', '', 'success');
            setTimeout(() => {
              Swal.close();
              ViewOutlet();
            }, 2000);
          }
        } catch (err) {
          Swal.fire('Something went wrong', '', 'error');
        }
      }
    });
  };
  //for determining whether to show success toast or not
  useEffect(() => {
    toastOutletStatus &&
      toast.success('Outlet updated Successfully', {
        autoClose: 3000,
        theme: 'colored',
        closeOnClick: true,
      });
    setTimeout(() => {
      setToastOutletStatus(false);
    }, 3000);
  }, [toastOutletStatus]);

  return (
    <div>
      <Breadcrumb pageName="Add Outlet" />
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add Outlet
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    City Name <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      //   value={selectedOption}
                      //   onChange={(e) => {
                      //     setSelectedOption(e.target.value);
                      //     changeTextColor();
                      //   }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        {' '}
                        Select your city
                      </option>

                      {cityData ? (
                        cityData.map((item, index) => (
                          <option
                            key={index}
                            value={item.id}
                            className="text-body dark:text-bodydark"
                          >
                            {item.city_name}
                          </option>
                        ))
                      ) : (
                        <option
                          value=""
                          disabled
                          className="text-body dark:text-bodydark"
                        >
                          {' '}
                          No City{' '}
                        </option>
                      )}
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
                    {touched.city && errors.city ? (
                      <p className="errormsg">{errors.city}</p>
                    ) : null}
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Outlet Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Enter your outlet name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.name && errors.name ? (
                    <p className="errormsg">{errors.name}</p>
                  ) : null}
                  <div></div>
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Outlet Address <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="outlet_address"
                    value={values.outlet_address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Enter Outlet Address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.outlet_address && errors.outlet_address ? (
                    <p className="errormsg">{errors.outlet_address}</p>
                  ) : null}
                  <div></div>
                </div>

                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Outlet Area <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="outlet_area"
                    value={values.outlet_area}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Enter Outlet Area"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.outlet_area && errors.outlet_area ? (
                    <p className="errormsg">{errors.outlet_area}</p>
                  ) : null}
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Outlet code <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="outlet_code"
                    value={values.outlet_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Enter Outlet code"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.outlet_code && errors.outlet_code ? (
                    <p className="errormsg">{errors.outlet_code}</p>
                  ) : null}
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-1/2 flex flex-col justify-center ">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Is Geofencing allowed <span className="text-meta-1">*</span>
                  </label>
                  <div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="testingoutlet"
                          value="1"
                          checked={values.testingoutlet == '1'} // Ensure it matches as a string
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="hidden"
                        />
                        <span className="w-5 h-5 inline-block border-2 border-gray-400 rounded-full flex items-center justify-center">
                          {values.testingoutlet == 1 && (
                            <span className="w-3 h-3 bg-blue-500 rounded-full relative top-[0.5px]"></span>
                          )}
                        </span>
                        <span>Yes</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="testingoutlet"
                          value="0"
                          checked={values.testingoutlet == '0'} // Ensure it matches as a string
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="hidden"
                        />
                        <span className="w-5 h-5 inline-block border-2 border-gray-400 rounded-full flex items-center justify-center">
                          {values.testingoutlet == 0 && (
                            <span className="w-3 h-3 bg-blue-500 rounded-full relative top-[0.5px]"></span>
                          )}
                        </span>
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </div>
                {values.testingoutlet == '1' && (
                  <>
                    {' '}
                    <div className="w-full lg:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Latitude <span className="text-meta-1">*</span>
                      </label>
                      <input
                        name="latitude"
                        value={values.latitude}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        placeholder="Enter latitude"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {touched.latitude && errors.latitude ? (
                        <p className="errormsg">{errors.latitude}</p>
                      ) : null}
                      <div></div>
                    </div>
                    <div className="w-full lg:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Longitude <span className="text-meta-1">*</span>
                      </label>
                      <input
                        name="longitude"
                        value={values.longitude}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        placeholder="Enter Longitude"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {touched.longitude && errors.longitude ? (
                        <p className="errormsg">{errors.longitude}</p>
                      ) : null}
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="flex  justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Add Outlet
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          View Outlet
        </h1>
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 lg:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Outlet Name
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Code
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Outlet City
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Latitude
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Longitude
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {outletData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-5 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  outletData.map((item, key) => (
                    <tr key={key}>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {item.outlet_name}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.outlet_code}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.city.city_name}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.outlet_latitude}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.outlet_longitude}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button className="hover:text-primary">
                            <TiEdit
                              onClick={() => {
                                setEditpopup(true);
                                setOutletId(item.id);
                              }}
                            />
                          </button>
                          {/* <button
                            className="hover:text-primary"
                            onClick={() => {
                              deleteOutlet(item.id);
                            }}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                fill=""
                              />
                            </svg>
                          </button> */}
                          {/* <button className="hover:text-primary">
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                                fill=""
                              />
                            </svg>
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {toastOutletStatus ? <ToastContainer /> : null}
            {editPopup && (
              <EditOutlet
                toastOutletStatus={toastOutletStatus}
                setToastOutletStatus={setToastOutletStatus}
                ViewOutlet={ViewOutlet}
                editPopup={editPopup}
                setEditpopup={setEditpopup}
                setOutletId={setOutletId}
                outletId={outletId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOutlet;
