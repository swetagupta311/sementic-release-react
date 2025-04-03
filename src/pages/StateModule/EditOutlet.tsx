import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useEffect } from 'react';
import { TiEdit } from 'react-icons/ti';
import { ImCancelCircle } from 'react-icons/im';
import { MdEditSquare } from 'react-icons/md';
import api from '../../api/apiService.js';
import { validationSchemaOutletEdit } from './validationSchemaOutletEdit';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
const EditOutlet = (props) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [cityData, setCityData] = useState([]);
  const [loaderforfetching, setLoaderforfetching] = useState(false);
  const [outletID, setOutletId] = useState();
  const [loaderforupdating, setLoaderforupdating] = useState(false);
  const initialValues = {
    name: '',
    code: '',
    latitude: '',
    longitude: '',
    city: 0,
    outlet_address: '',
    outlet_area: '',
    outlet_code: '',
    testingoutlet: '',
  };
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema: validationSchemaOutletEdit,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      editOutlet(values);
    },
  });
  useEffect(() => {
    ViewCity();
    ViewOutlet();
  }, []);

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

  //for getting outlet info  to show in edit popup
  const ViewOutlet = async () => {
    setLoaderforfetching(true);
    try {
      const response = await api.get('/getoutlets');

      if (response.status === 200) {
        const filteredData = response.data.filter(
          (item) => item.id == props.outletId,
        );

        if (filteredData.length > 0) {
          const outlet = filteredData[0];
          setOutletId(outlet.id);
          setFieldValue('name', outlet.outlet_name);
          setFieldValue('latitude', outlet.outlet_latitude);
          setFieldValue('longitude', outlet.outlet_longitude);
          setFieldValue('outlet_address', outlet.outlet_address);
          setFieldValue('outlet_area', outlet.outlet_area);
          setFieldValue('city', outlet.city_id);
          setFieldValue('outlet_code', outlet.outlet_code);
          setFieldValue('testingoutlet', outlet.isTestingOutlet);
        }
      }
    } catch (err) {
      console.error('Error fetching employee data:', err);
    } finally {
      setLoaderforfetching(false);
    }
  };

  //put api to edit outlet
  const editOutlet = async (values) => {
    setLoaderforupdating(true);
    // const loadingToast = toast.loading('hey Outlet...', {
    //   theme: 'colored',
    //   closeOnClick: true,
    // });

    try {
      const response = await api.put(`/editoutlet/${props.outletId}`, {
        outlet_name: values.name,
        outlet_latitude: values.latitude,
        outlet_area: values.outlet_area,
        outlet_address: values.outlet_address,
        outlet_longitude: values.longitude,
        city_id: values.city,
        outlet_code: values.outlet_code.toUpperCase(),
        isTestingOutlet: values.testingoutlet,
      });

      if (response.status === 200) {
        props.setEditpopup(false);
        props.setToastOutletStatus(!props.toastOutletStatus);
        resetForm();
        // toast.update(loadingToast, {
        //   render: 'Outlet module updated successfully!',
        //   type: 'success',
        //   isLoading: false,
        //   autoClose: 3000,
        //   theme: 'colored',
        //   closeOnClick: true,
        // });
        props.ViewOutlet();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          (Array.isArray(err.response?.data?.errors)
            ? err.response.data.errors[0]?.msg
            : 'Something went wrong'),
        {
          type: 'error',
          isLoading: false,
          autoClose: 3000,
          theme: 'colored',
          closeOnClick: true,
        },
      );

      console.log(err);
    } finally {
      setLoaderforupdating(false);
    }
  };

  return (
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
              onClick={() => props.setEditpopup(!props.editPopup)}
            >
              <ImCancelCircle className="h-12 w-[23px]" />
            </button>
            <div className="bg-white px-2 pt-3 pb-2 sm:p-4 sm:pb-2">
              <div className="sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
                  <MdEditSquare className="h-12 w-[23px]" />
                </div>
                <div className="mt-3  sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="font-semibold text-gray-900 text-2xl mt-4"
                    id="modal-title"
                  >
                    Edit Outlet
                  </h3>
                  <div className="mt-2">
                    {' '}
                    <form onSubmit={handleSubmit}>
                      <div className="">
                        <div className="mb-4.5 flex flex-col lg:flex-row gap-6">
                          <div className="w-full xl:w-1/2">
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

                          <div className="w-full xl:w-1/2">
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
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 lg:flex-row">
                          <div className="w-full lg:w-1/2 flex flex-col justify-center ">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Is Geofencing allowed{' '}
                              <span className="text-meta-1">*</span>
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
                                  Latitude{' '}
                                  <span className="text-meta-1">*</span>
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
                                  Longitude{' '}
                                  <span className="text-meta-1">*</span>
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
                        <div className="mb-4.5 flex flex-col lg:flex-row gap-6">
                          <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Outlet Address{' '}
                              <span className="text-meta-1">*</span>
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
                              <p className="errormsg">
                                {errors.outlet_address}
                              </p>
                            ) : null}
                            <div></div>
                          </div>

                          <div className="w-full xl:w-1/2">
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
                          <div className="w-full xl:w-1/2">
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

                        <button
                          type="submit"
                          className="flex  justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />{' '}
        </div>
      </div>
    </div>
  );
};

export default EditOutlet;
