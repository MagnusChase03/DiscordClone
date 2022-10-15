import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { redirect } from "react-router-dom";



export default function AuthWindow(props) {
    const navigate = useNavigate();
    const [page, setPage] = useState(false);

    useEffect(() => {
        if (page) {
            navigate('/serverselect');
        }
    });

    return (
        <>
            <h3>AUTH</h3>
            <button onClick={() => {setPage(true)}}>Server Selection</button>
        </>
    );
}