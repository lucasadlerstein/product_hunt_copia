import styled from '@emotion/styled';

const Boton = styled.a`
    display: block;
    text-align:center;
    font-weight: 700;
    text-transform: uppercase;
    border: 1px solid #e1e1e1;
    padding: .8rem 2rem;
    margin: 2rem auto;
    background-color: ${props => props.bgColor ? '#DA55DF' : 'white'};
    color: ${props => props.bgColor ? 'white' : '#000'};
    transition: all .5s ease;

    &:last-of-type{
        margin-right:0;
    }

    &:hover{
        cursor: pointer;
        ${props => props.bgColor ? (
            'color: black;'
        ) : (
            'border: 1px solid black;'
        )}
    }
`;

export default Boton;