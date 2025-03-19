import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../interfaces/auth.types"
import UserError from "../../interfaces/UserError";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const UpdateUser = () => {

    // States
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<UserError>({});
    const [loading, setLoading] = useState(true);

    // Yup
    const validationSchema = Yup.object({
        email: Yup.string().email('Please enter a valid email.').required('Please enter an email.'),
        firstname: Yup.string().required('Please enter a first name.').min(2, "The first name must be at least 2 characters.").max(20, "The first name can't be longer than 20 characters."),
        lastname: Yup.string().required('Please enter a last name.').min(2, "The last name must be at least 2 characters.").max(50, "The last name can't be longer than 50 characters."),
        country: Yup.string().required('Please enter a country.'),
        city: Yup.string().required('Please enter a city.'),
    });


    //Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");

            try {
                const res = await fetch(`https://read-y-api.onrender.com/user/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    }
                });

                if (!res.ok) throw new Error("Failed to fetch user data");

                const data = await res.json();
                setUser(data);

            } catch (err) {
                console.error("Failed to fetch user data", err);
                setError("Failed to fetch user data");
            } finally {
                setLoading(false);
            }

        };

        if (id) fetchUserData();
    }, [id]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (!user) return; // Se till att user finns

        const token = localStorage.getItem("token");

        try {
            // Validate
            await validationSchema.validate(user, { abortEarly: false });

            // Ta bort undefined/null värden
            const cleanedUser = Object.fromEntries(
                Object.entries(user).filter(([_, v]) => v != null && v !== "")
            );

            // Skicka uppdaterad data
            const resp = await fetch(`https://read-y-api.onrender.com/user/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(cleanedUser)
            });

            if (!resp.ok) {
                throw new Error("Failed to update user");
            }

            navigate(-1);  // Gå tillbaka

        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const validationErrors: UserError = {};
                err.inner.forEach(error => {
                    const prop = error.path as keyof UserError;
                    validationErrors[prop] = error.message;
                });
                setErrors(validationErrors);
            } else {
                console.error("Error updating user:", err);
                setError("Something went wrong while updating the user.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>

                <input
                    placeholder={user?.email ? user.email : "email@email.com"}
                    type="email"
                    name="email"
                    id="email"
                    value={user?.email || ""}
                    onChange={handleChange} />
                {errors?.email && <p>{errors.email}</p>}

                <input
                    placeholder={user?.firstname ? user.firstname : "First Name"}
                    type="text"
                    name="firstname"
                    id="firstname"
                    value={user?.firstname || ""}
                    onChange={handleChange} />
                {errors?.firstname && <p>{errors.firstname}</p>}

                <input
                    placeholder={user?.lastname ? user.lastname : "Last Name"}
                    type="text"
                    name="lastname"
                    id="lastname"
                    value={user?.lastname || ""}
                    onChange={handleChange} />
                {errors?.lastname && <p>{errors.lastname}</p>}

                <input
                    placeholder={user?.city ? user.city : "City"}
                    type="text"
                    name="city"
                    id="city"
                    value={user?.city || ""}
                    onChange={handleChange} />
                {errors?.city && <p>{errors.city}</p>}

                <input
                    placeholder={user?.country ? user.country : "Country"}
                    type="text"
                    name="country"
                    id="country"
                    value={user?.country || ""}
                    onChange={handleChange} />
                {errors?.country && <p>{errors.country}</p>}

                <div style={{ marginTop: "1em" }} className="grid">
                    <button style={{ marginRight: "1em" }} onClick={() => navigate(-1)}>Cancel</button>
                    <button style={{ marginLeft: "1em" }} className="btn-update" type="submit">Update User</button>

                </div>

            </form>
        </div>
    )
}

export default UpdateUser