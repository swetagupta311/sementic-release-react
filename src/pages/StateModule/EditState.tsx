import React, { useState, useEffect } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { MdEditSquare } from 'react-icons/md';
import { useFormik } from 'formik';
import { validationSchemaEditState } from './validationSchemaEditState';
import Select from 'react-select';
import api from '../../api/apiService.js';
import { ToastContainer, toast } from 'react-toastify';
const EditState = (props) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [stateID, setStateID] = useState();
  //for storing brands to show in dropdown
  const [brandData, setBrandData] = useState([]);
  //for settign singlebrand
  const [cityDataID, setCityDataID] = useState([]);
  //for determining put api sucess
  const [loading, setLoading] = useState(false);
  const [loaderforfetching, setLoaderforfetching] = useState(false);
  const [loaderforupdating, setLoaderforupdating] = useState(false);
  const initialValues = {
    city: '',
    state: '',
    brands: [],
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
    validationSchema: validationSchemaEditState,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      editState(values);
    },
  });
  //callig function to view brand data
  useEffect(() => {
    getBrands();
    ViewState();
  }, []);
  //for getting brands to show in dropdown
  const getBrands = async () => {
    try {
      const response = await api.get('/getbrands');
      if (response.status === 200) {
        setBrandData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //for getting city to show in edit popup
  const ViewState = async () => {
    setLoaderforfetching(true);
    try {
      const response = await api.get('/getcities');

      if (response.status === 200) {
        const filteredData = response.data.filter(
          (item) => item.id == props.cityId,
        );

        if (filteredData.length > 0) {
          const state = filteredData[0];
          setStateID(state.id);
          setFieldValue('state', state.state_name);
          setFieldValue('city', state.city_name);

          // Extract and set selected brands
          const selectedBrands = state.brands.map((brand) => ({
            label: brand.brand_name,
            value: brand.id, // Corrected to store brand.id directly
          }));

          setSelectedOptions(selectedBrands);

          // Set only IDs in Formik
          const brandIDs = selectedBrands.map((brand) => brand.value);
          setFieldValue('brands', brandIDs);
          console.log(brandIDs);
        }
      }
    } catch (err) {
      console.error('Error fetching employee data:', err);
    } finally {
      setLoaderforfetching(false);
    }
  };

  //put api to edit state
  const editState = async (values) => {
    setLoaderforupdating(true);
    const loadingToast = toast.loading('Updating City...', {
      theme: 'colored',
      closeOnClick: true,
    });

    try {
      const response = await api.put(`/editcity/${props.cityId}`, {
        state_name: values.state,
        city_name: values.city,
        brands: values.brands,
      });

      if (response.status === 200) {
        props.setEditpopup(false);
        props.setToastCityStatus(!props.toastCityStatus);
        resetForm();
        toast.update(loadingToast, {
          render: 'City module updated successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          theme: 'colored',
          closeOnClick: true,
        });
        props.ViewState();
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
      console.log(err);
    } finally {
      setLoaderforupdating(false);
    }
  };
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleChange1 = (selected) => {
    setSelectedOptions(selected || []); // Store full objects
    const brandIDs = selected ? selected.map((option) => option.value) : [];
    setFieldValue('brands', brandIDs); // Store only IDs in Formik
  };

  // Use useEffect to update the field value when selectedOptions changes
  // useEffect(() => {
  //   if (selectedOptions.length > 0) {
  //     setFieldValue('brands', selectedOptions);
  //   }
  // }, [selectedOptions]);

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
                        Edit City
                      </h3>
                      <div className="mt-2">
                        {' '}
                        <form onSubmit={handleSubmit}>
                          <div className="">
                            <div className="mb-4.5 flex flex-col gap-6 lg:flex-row xl:flex-row">
                              <div className="w-full lg:w-full xl:w-1/2">
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
                              <div className="lg:w-full xl:w-1/2">
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
                                  placeholder="Enter City"
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                {touched.city && errors.city ? (
                                  <p className="errormsg">{errors.city}</p>
                                ) : null}
                                <div></div>
                              </div>
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 lg:flex-row xl:flex-row">
                              <div className="w-full xl:w-full">
                                <label className="mb-2.5 block text-black dark:text-white">
                                  Select Brands{' '}
                                  <span className="text-meta-1">*</span>
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                  <div>
                                    <Select
                                      options={
                                        brandData
                                          ? brandData.map((item) => ({
                                              label: item.brand_name,
                                              value: item.id,
                                            }))
                                          : []
                                      }
                                      isMulti
                                      onChange={handleChange1}
                                      value={selectedOptions} // Make sure selectedOptions is an array of {label, value}
                                    />

                                    {/* <p>Selected Values: {JSON.stringify(selectedOptions)}</p> */}
                                  </div>
                                  {touched.brands && errors.brands ? (
                                    <p className="errormsg">{errors.brands}</p>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={loading}
                              className="flex  justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                              Save
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
          <ToastContainer />{' '}
        </div>
      </div>
    </div>
  );
};

export default EditState;
