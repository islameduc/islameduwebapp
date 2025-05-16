import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../store';
import 'react-quill/dist/quill.snow.css';
import styles from './editor-page.module.css';
import { backendUrls } from '../../../api/urls';
import { paths } from '../../../routers/paths';
import NavBar from '../../../components/shared/navbar/NavBar';
import Footer from '../../../components/shared/footer/Footer';

interface Detail {
    _id: string;
    title: string;
    content: string;
}

export const getDetailsAction = createAsyncThunk('details/get-details', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axiosInstance.get(backendUrls.users.ABOUT_US);
        return res?.data?.result;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error);
        }
    }
});

const EditorPage = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [vision, setVision] = useState('');
    const [mission, setMission] = useState('');
    const [whoWeAre, setWhoWeAre] = useState('');
    const [whatWeDo, setWhatWeDo] = useState('');
    const [details, setDetails] = useState<Detail[]>([])

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('mission', mission);
        formData.append('whatWeDo', whatWeDo);
        formData.append('vision', vision);
        formData.append('whoWeAre', whoWeAre);

        try {
            const response = await fetch(backendUrls.users.ABOUT_US, {
                method: 'PATCH',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${user?.accessToken}`
                },
            });

            if (response.ok) {
                toast.success('Update successful')
                navigate(paths.AboutUs);
            } else {
                console.error('Failed to update about us');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchDetails = () => {
        dispatch(getDetailsAction()).then((res: any) => {
            const { payload } = res;
            if (payload) {
                const fetchedDetails = payload;
                console.log(fetchedDetails);
                setDetails(fetchedDetails)
            }
        });
    };

    const getDetailByTitle = (title: string) => {
        return details.find(detail => detail.title === title);
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    useEffect(() => {
        setMission(getDetailByTitle('mission')?.content || '')
        setVision(getDetailByTitle('vision')?.content || '')
        setWhatWeDo(getDetailByTitle('whatWeDo')?.content || '')
        setWhoWeAre(getDetailByTitle('whoWeAre')?.content || '')
    }, [details]);

    return (
        <div>
            <NavBar />
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Edit About Us Content</h1>
                </header>

                <section className={styles.section}>
                    <h2>Vision</h2>
                    <ReactQuill value={vision} onChange={setVision} />
                </section>

                <section className={styles.section}>
                    <h2>Mission</h2>
                    <ReactQuill value={mission} onChange={setMission} />
                </section>

                <section className={styles.section}>
                    <h2>Who We Are</h2>
                    <ReactQuill value={whoWeAre} onChange={setWhoWeAre} />
                </section>

                <section className={styles.section}>
                    <h2>What We Do</h2>
                    <ReactQuill value={whatWeDo} onChange={setWhatWeDo} />
                </section>

                <button className={styles.saveButton} onClick={handleSave}>Save</button>
            </div>
            <Footer />
        </div>
    );
};

export default EditorPage;
