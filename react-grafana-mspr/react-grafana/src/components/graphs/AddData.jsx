import React, { Component } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
    padding: 20px;
    background-color: #f8f8f8;
    min-height: 100vh;
    color: #333;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const Button = styled.button`
    padding: 10px;
    font-size: 16px;
    background-color: ${(props) => (props.disabled ? '#ccc' : '#28a745')};
    color: white;
    border: none;
    border-radius: 5px;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    &:hover {
        background-color: ${(props) => (props.disabled ? '#ccc' : '#218838')};
    }
`;

class AddData extends Component {
    state = {
        nomPays: '',
        total_cases: '',
        total_deaths: '',
        total_recoveries: '',
        total_active_cases: '',
        message: '',
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { nomPays, total_cases, total_deaths, total_recoveries, total_active_cases } = this.state;
    
        if (!nomPays || !total_cases || !total_deaths || !total_recoveries || !total_active_cases) {
            this.setState({ message: "❌ Veuillez remplir tous les champs." });
            return;
        }
    
        const token = localStorage.getItem('token');
        if (!token) {
            this.setState({ message: "🚫 Vous devez être connecté pour ajouter des données." });
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3005/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nomPays, total_cases, total_deaths, total_recoveries, total_active_cases }),
            });
    
            if (response.ok) {
                this.setState({ message: "✅ Données ajoutées avec succès !" });
            } else {
                this.setState({ message: "❌ Échec de l'ajout des données." });
            }
        } catch (error) {
            console.error("❌ Erreur serveur:", error);
            this.setState({ message: "❌ Erreur serveur, réessayez plus tard." });
        }
    };
    
    

    render() {
        const { nomPays, total_cases, total_deaths, total_recoveries, total_active_cases, message } = this.state;
        const isDisabled = !nomPays || !total_cases || !total_deaths || !total_recoveries || !total_active_cases;

        return (
            <FormContainer>
                <h1>➕ Ajouter des Données COVID-19</h1>
                <form onSubmit={this.handleSubmit}>
                    <Input type="text" name="nomPays" placeholder="Pays" value={nomPays} onChange={this.handleChange} />
                    <Input type="number" name="total_cases" placeholder="Total des cas" value={total_cases} onChange={this.handleChange} />
                    <Input type="number" name="total_deaths" placeholder="Total des décès" value={total_deaths} onChange={this.handleChange} />
                    <Input type="number" name="total_recoveries" placeholder="Total des guérisons" value={total_recoveries} onChange={this.handleChange} />
                    <Input type="number" name="total_active_cases" placeholder="Total des cas actifs" value={total_active_cases} onChange={this.handleChange} />
                    
                    <Button type="submit" disabled={isDisabled}>➕ Ajouter</Button>
                </form>
                {message && <p>{message}</p>}
            </FormContainer>
        );
    }
}

export default AddData;
