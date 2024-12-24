import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ButtonTemplate, FormTemplate } from "@/components";
import { router } from 'expo-router';
import CApi from '../lib/CApi';
import { useSelector, useDispatch } from 'react-redux';
import { setData, resetData } from '../store/reducer/loginReducer';
import React from "react";

export default function Register() {
    const registerForm = useSelector((state) => state.login.loginInput);
    const dispatch = useDispatch();

    const onChangeValue = (payload: any) => {
        dispatch(setData({ ...registerForm, ...payload }));
    };

    const onSaveData = async () => {
        try {
            if (registerForm.password !== registerForm.confirm_password) {
                ToastAndroid.show("Passwords do not match!", ToastAndroid.SHORT);
                return;
            }

            const { data } = await CApi.post('/register', registerForm, {
                headers: { 'Content-Type': 'text/plain' }
            });

            ToastAndroid.show("Register Success", ToastAndroid.SHORT);

            dispatch(resetData());
            router.push('/login')
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || 'Something went wrong';
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        }
    };

    const routeBack = () => {
        router.push('/login');
    };

    // Validasi password
    const isPasswordValid = registerForm.password?.length >= 8;
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(registerForm.password);

    return (
        <ScrollView style={style.scroll}>
            <View style={style.section}>
                <View style={style.navbar}>
                    <TouchableOpacity onPress={routeBack} style={style.backButton}>
                        <Octicons name="chevron-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={[style.navPlaceholder, style.fontFamily]}>Register Account</Text>
                </View>

                <View style={style.container}>
                    <View style={style.shape}>
                        <AntDesign name="lock1" size={24} color="#5E62DB" />
                    </View>
                    <Text style={[style.title, style.fontFamily]}>Create New Account</Text>
                    <Text style={[style.subtitle, style.fontFamily]}>
                        Your new password must be different from previously used passwords.
                    </Text>
                </View>

                <FormTemplate
                    style={[style.input, { borderRadius: 10 }]}
                    label="Name"
                    placeholder="Enter Your Name"
                    change={(val: any) => onChangeValue({ name: val })}
                    value={registerForm.name}
                />

                <FormTemplate
                    style={[style.input, { borderRadius: 10 }]}
                    label="Email"
                    placeholder="Enter Your Email"
                    change={(val: any) => onChangeValue({ email: val })}
                    value={registerForm.email}
                />

                <FormTemplate
                    style={[style.input, { borderRadius: 10 }]}
                    label="New Password*"
                    placeholder="Enter Your New Password"
                    change={(val: any) => onChangeValue({ password: val })}
                    value={registerForm.password}
                    max={8}
                    secure={true}
                />

                <FormTemplate
                    style={[style.input, { borderRadius: 10 }]}
                    label="Phone No*"
                    placeholder="Phone No"
                    change={(val: any) => onChangeValue({ confirm_password: val })}
                    value={registerForm.confirm_password}
                    max={8}
                    secure={true}
                />

                {/* Validasi Password */}
                <View style={style.check}>
                    <AntDesign
                        name={isPasswordValid ? "checkcircle" : "closecircle"}
                        size={13}
                        color={isPasswordValid ? "#5E62DB" : "red"}
                    />
                    <Text style={style.checkStatus}>Must be at least 8 characters</Text>
                </View>

                <View style={style.check}>
                    <AntDesign
                        name={hasSpecialCharacter ? "checkcircle" : "closecircle"}
                        size={13}
                        color={hasSpecialCharacter ? "#5E62DB" : "red"}
                    />
                    <Text style={style.checkStatus}>Must contain one special character</Text>
                </View>

                <ButtonTemplate
                    style={style.button}
                    title="Submit"
                    onPress={onSaveData}
                />
            </View>
        </ScrollView>
    );
}

const style = StyleSheet.create({
    fontFamily: {
        fontFamily: 'sans-serif',
    },

    scroll: {
        backgroundColor: "#1E2842", // Latar belakang biru gelap
    },

    section: {
        flex: 1,
        padding: 20,
        backgroundColor: "#1E2842", // Latar belakang biru gelap
    },

    backButton: {
        left: -100,
    },

    navbar: {
        display: 'flex',
        flexDirection: 'row',
        padding: 30,
        justifyContent: 'center',
    },

    navPlaceholder: {
        fontSize: 14,
        color: '#FFFFFF', // Teks berwarna putih
        fontWeight: '500',
    },

    container: {
        alignItems: 'center',
    },

    shape: {
        width: 52,
        height: 50,
        backgroundColor: '#EFEFFB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    title: {
        fontSize: 20,
        color: '#FFFFFF', // Warna teks putih
        fontWeight: '600',
        marginTop: 24,
    },

    subtitle: {
        color: '#FFFFFF', // Warna teks putih
        fontSize: 14,
        width: '70%',
        textAlign: 'center',
        marginTop: 6,
    },

    check: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    checkStatus: {
        marginLeft: 10,
        fontSize: 12,
        color: '#FFFFFF', // Warna teks putih
    },

    input: {
        backgroundColor: '#F4E1D2', // Warna krem untuk kolom input
        padding: 12,
        marginTop: 12,
    },

    button: {
        padding: 15,
        borderRadius: 23,
        marginTop: 12,
        backgroundColor: '#FF8C00', // Warna oranye untuk tombol
    },
});
