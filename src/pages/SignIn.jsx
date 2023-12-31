import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import {
  useNavigate,
  //  Link 
} from 'react-router-dom'
import PulseLoader from 'react-spinners/PulseLoader'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

// import usePersist from '../hooks/usePersist'
import { setCredentials } from '../tools/auth/authSlice'
import { useLoginMutation } from '../tools/auth/authApiSlice'

import useTitle from '../hooks/useTitle'
// import useAuth from '../hooks/useAuth';

const SignIn = () => {
  useTitle("Student Login");

  const [FormFilled, setFormFilled] = useState(false);
  const [passwordFilled, setpasswordFilled] = useState(false);
  const [RegistrationNumberFilled, setRegistrationNumberFilled] = useState(false);
  const [RegistrationNumber, setRegistrationNumber] = useState('');
  const [Password, setPassword] = useState('');
  // const [persist, setPersist] = usePersist()

  const [PasswordVisible, setPasswordVisibility] = useState(false);
  const [checkedstate,setcheckedstate]=useState(false)
  const [token, settoken] = useState(true); // Changed default value
  const [errMsg, setErrMsg] = useState('');

  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();
    // const { isLoggedIn } = useAuth()

  const [login, { isLoading }] = useLoginMutation();

  const HandlePasswordVisibility = () => {
    setPasswordVisibility(!PasswordVisible);
    // console.log(PasswordVisible);
  };

  const ToggleSubmissionItem = () => {
    settoken(!token)
    setcheckedstate(!checkedstate)
    // console.log(token)
    // console.log(checkedstate)
  };

  const AttemptLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ 'reg_no': RegistrationNumber, [token? 'token':'password']: Password }).unwrap();
      dispatch(setCredentials({ accessToken: response.token, registrationNumber: RegistrationNumber, isLoggedIn: true }));
      localStorage.setItem('token', response.token);
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('registrationNumber', RegistrationNumber);
      setRegistrationNumber('');
      setPassword('');
      setErrMsg('');
      navigate('/userdashboard');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Incorrect Username or Password');
      } else if (err.status === 401) {
        setErrMsg('Unauthorized');
      } else if (err.status === 500) {
        setErrMsg('Server-Side Error');
      } else {
        setErrMsg(err.data?.message);
      }
      if (errRef.current) {
        errRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      errRef.current.focus();
    }
  };

  useEffect(() => {
    setErrMsg('');
    setRegistrationNumberFilled(RegistrationNumber !== '');
    setpasswordFilled(Password !== '');
    setFormFilled(RegistrationNumberFilled && passwordFilled);
  }, [RegistrationNumber, Password]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  return (
    <div className='w-full h-screen bg-faintgreen flex flex-col justify-center items-center'>
      <div className={errMsg ? 'w-full absolute top-0 py-2 bg-black/70' : "hidden"}>
        <p ref={errRef} className={errMsg ? " w-full text-center font-bold text-red-500 text-sm" : "hidden"} aria-live="assertive">{errMsg}</p>
      </div>
      <section className='bg-black/80 rounded-3xl max-w-[300px] w-[95%] min-h-[300px] p-5 shadow-lg'>
        <div className="">
          <form className="form" onSubmit={AttemptLogin}>
            <div className=" relative max-w-[230px] mx-auto">
              <div className="welcome-lines text-center leading-tight">
                <div className="welcome-line-1 text-green-500 font-semibold text-4xl">
                  SD
                </div>
                <div className="welcome-line-2 text-white text-lg my-3">Welcome</div>
              </div>
              <section className='w-full text-sm text-white flex flex-row justify-center gap-1 items-center'>
                <p>Token</p>
                <section className="switch" 
                 onClick={ToggleSubmissionItem}
                 >
                  <input type="checkbox" 
                    checked={checkedstate? true:false}
                    readOnly
                  />
                  <span className="slider"></span>
                </section>
                <p>Password</p>
              </section>
              <div className="mt-5 space-y-5">
                <div className="form-inp bg-black/70 w-full">
                  <input
                    placeholder="Registration Number"
                    type="text"
                    id="RegistrationNumber"
                    value={RegistrationNumber}
                    ref={userRef}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="uppercase placeholder:normal-case px-5 py-3 bg-transparent border border-gray-300 w-full focus:border-green-500 outline-none"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="form-inp flex justify-between bg-black/70">
                  <input
                    placeholder={token? 'Token':'Password'}
                    type={PasswordVisible ? "text" : "password"}
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="Password"
                    className="px-5 py-3 bg-transparent border border-gray-300 w-full focus:border-green-500 outline-none"
                    autoComplete="off"
                    required
                  />
                  <div type='' onClick={HandlePasswordVisibility}>
                    <FontAwesomeIcon
                      icon={PasswordVisible ? faEye : faEyeSlash}
                      size="sm"
                      style={{ color: "#22c55e", marginLeft: 'auto' }} />
                  </div>
                </div>
              </div>
              <div className="mt-5">
                {isLoading ? (
                  <div className='w-full justify-center py-[21px] mb-4 flex h-full'>
                    <PulseLoader size={5} color={"#22C55E"} />
                  </div>
                ) : (
                  <button
                    disabled={!FormFilled}
                    className={`submit-button w-full px-4 py-3 submit-button font-semibold rounded-lg text-lg transition-all ease-in-out duration-300
                  ${FormFilled ? 'text-green-500 bg-black/60 border border-green-500 hover:bg-green-500 hover:text-black hover:cursor-pointer ' : 'text-gray-500  outline outline-[1px] outline-gray-500 cursor-not-allowed'}`}
                  >
                    Login
                  </button>
                )}
              </div>
               {/* <div>
                <label htmlFor="persist" className="w-full  flex justify-center mt-3">
                  <input
                    type="checkbox"
                    className=""
                    id="persist"
                    onChange={handleToggle}
                    checked={persist}
                  />
                  <p
                    className='text-gray-500 ml-2 text-sm'
                  >
                    Trust This Device
                  </p>
                </label>
              </div> */}
              <div className="text-center mt-2">
                {/* <Link to="/PasswordRecovery" className="text-gray-500 text-sm no-underline hover:text-gray-300">Forgot password?</Link> */}
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default SignIn;
