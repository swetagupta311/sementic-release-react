import React, { useState } from 'react';
import { ImCancelCircle } from 'react-icons/im';
const ViewSurvey = (props) => {
  const [loaderforfetching, setLoaderforfetching] = useState(false);

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
              onClick={() => props.setViewStatus(!props.viewStatus)}
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
                    <div className="mt-3  sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="font-semibold text-gray-900 text-2xl mt-4"
                        id="modal-title"
                      >
                       Survey Data
                      </h3>
                      <div className="mt-2">
                        {' '}
                        <div className="p-6.5">
                          <div className="mb-4.5 flex flex-col lg:flex-row gap-6"></div>
                          <div className="mb-4.5 flex flex-col lg:flex-row gap-6">
                            <div className="w-full xl:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Activity Day{' '}
                                <span className="text-meta-1">*</span>
                              </label>
                              <input
                                type="text"
                                name="day"
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />
                            </div>
                            <div className="w-full xl:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Activity Day{' '}
                                <span className="text-meta-1">*</span>
                              </label>
                              <input
                                type="text"
                                name="day"
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />
                            </div>
                            <div className="w-full xl:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Activity Day{' '}
                                <span className="text-meta-1">*</span>
                              </label>
                              <input
                                type="text"
                                name="day"
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />
                            </div>
                          </div>
                       
                        <div className="mb-4.5 flex flex-col lg:flex-row gap-6">
                          <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Activity Day{' '}
                              <span className="text-meta-1">*</span>
                            </label>
                            <input
                              type="text"
                              name="day"
                              disabled
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                          </div>
                          <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Activity Day{' '}
                              <span className="text-meta-1">*</span>
                            </label>
                            <input
                              type="text"
                              name="day"
                              disabled
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                          </div>
                        </div>
                        <div className="mb-4.5 flex flex-col lg:flex-row gap-6">
                          <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Activity Day{' '}
                              <span className="text-meta-1">*</span>
                            </label>
                            <input
                              type="text"
                              name="day"
                              disabled
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                          </div>
                          <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Activity Day{' '}
                              <span className="text-meta-1">*</span>
                            </label>
                            <input
                              type="text"
                              name="day"
                              disabled
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                          </div>
                        </div>
                        <div className="mb-4.5 flex flex-col lg:flex-row gap-6">
                          <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Activity Day{' '}
                              <span className="text-meta-1">*</span>
                            </label>
                            <input
                              type="text"
                              name="day"
                              disabled
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                          </div>
                          <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Activity Day{' '}
                              <span className="text-meta-1">*</span>
                            </label>
                            <input
                              type="text"
                              name="day"
                              disabled
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                          </div>
                        </div>
                    
                      </div>
                    
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
  );
};

export default ViewSurvey;
