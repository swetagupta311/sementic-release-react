import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useEffect } from 'react';
import { TiEdit } from 'react-icons/ti';
import { useFormik } from 'formik';
import { validationSchemacity } from './validationSchemacity';
import EditState from './EditState';
import Select from 'react-select';
import api from '../../api/apiService.js';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
const AddState = () => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [editPopup, setEditpopup] = useState(false);
  const [cityId, setCityId] = useState();

  //for storing the cityData
  const [cityData, setCityData] = useState([]);
  //for storing brands to show in dropdown
  const [brandData, setBrandData] = useState([]);
  //for determining post api sucess
  const [loading, setLoading] = useState(false);
  const [toastCityStatus,setToastCityStatus]=useState(false);
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
    validationSchema: validationSchemacity,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (values) => {
      AddState(values);
      console.log(values);
    },
  });

  //
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange1 = (selected) => {
    const newSelectedOptions = selected ? selected.map((option) => option.value) : [];
    setSelectedOptions(newSelectedOptions); // Update selected options state
  };
  
  // Use useEffect to update the field value when selectedOptions changes
  useEffect(() => {
    if (selectedOptions.length > 0) {
      setFieldValue('brands', selectedOptions);
    }
  }, [selectedOptions]); 
  

  //callig function to view state data
  useEffect(() => {
    ViewState();
    getBrands();
  }, []);
//for determining whether to show success toast or not
  useEffect(() => {
    toastCityStatus&&toast.success('City updated Successfully', {
      autoClose: 3000,
      theme: 'colored',
      closeOnClick: true,
    });
    setTimeout(() => {
      setToastCityStatus(false)
    }, 3000);
    
  }, [toastCityStatus]);

  //post API for adding state
  const AddState = async (values) => {
    setLoading(true);
    const loadingToast = toast.loading('Adding State...', {
      theme: 'colored',
      closeOnClick: true,
    });
    const lowercaseCity = values.city.toLowerCase();
    const capitalizedCity = lowercaseCity.charAt(0).toUpperCase() + lowercaseCity.slice(1);
    

    try {
      const response = await api.post('/addcity', {
        city_name: capitalizedCity,
        state_name: values.state,
        brands: values.brands,
      });
      if (response.status === 201) {
        ViewState();
        resetForm();
        setLoading(false);
        toast.update(loadingToast, {
          render: 'City added successfully!',
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
    } finally {
      setLoading(false);
    }
  };

  //get API for viewing state in view table
  const ViewState = async () => {
    try {
      const response = await api.get('/getcities');
      if (response.status === 200) {
        setCityData(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
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

  //API for deleting the city
  const deleteCity = (id) => {
    Swal.fire({
      title: 'Do you want to Delete the city',
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
          const response = await api.delete(`/deletecity/${id}`);
          if (response.status === 200) {
            Swal.fire('Deleted!', '', 'success');
            setTimeout(() => {
              Swal.close();
              ViewState();
            }, 2000);
          }
        } catch (err) {
          Swal.fire('Something went wrong', '', 'error');
        }
      }
    });
  };

  return (
    <div>
      <Breadcrumb pageName="Add City" />
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Add City</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
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
                    placeholder="Enter City"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.city && errors.city ? (
                    <p className="errormsg">{errors.city}</p>
                  ) : null}
                  <div></div>
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Select Brands <span className="text-meta-1">*</span>
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
                      />

                      {/* <p>Selected Values: {JSON.stringify(selectedOptions)}</p> */}
                    </div>
                    {touched.brands && errors.brands ? (
                      <p className="errormsg p-6">{errors.brands}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex  justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Add City
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          View City
        </h1>
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    State
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    City
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Brand Count
                  </th>

                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {cityData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-5 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  cityData.map((item, key) => (
                    <tr key={key}>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {item.state_name}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.city_name}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.brands.length}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button className="hover:text-primary">
                            <TiEdit
                              onClick={() => {
                                setEditpopup(true);
                                setCityId(item.id);
                              }}
                            />
                          </button>
                          {/* <button
                            className="hover:text-primary"
                            onClick={() => {
                              deleteCity(item.id);
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
                              <path
                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                fill=""
                              />
                              <path
                                d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                fill=""
                              />
                              <path
                                d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
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
            {toastCityStatus ? <ToastContainer /> : null}
            {editPopup && (
              <EditState
                editPopup={editPopup}
                setEditpopup={setEditpopup}
                setCityId={setCityId}
                cityId={cityId}
                ViewState={ViewState}
                setToastCityStatus={setToastCityStatus}
                toastCityStatus={toastCityStatus}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddState;
