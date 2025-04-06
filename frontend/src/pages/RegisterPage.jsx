export default function Register() {
   return (
      <div>
         <h1>Register</h1>
         <p>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
         </p>
         <p>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
         </p>
         <p>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" />
         </p>
         <p>
            <button>Register</button>
         </p>
      </div>
   );
}