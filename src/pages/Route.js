import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import QRCode from "qrcode.react";
import styled from "styled-components";
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
  IoMdRadioButtonOff,
  IoMdCheckmarkCircle
} from "react-icons/io";
import Button from "../components/common/Button";
import { AUTH_TOKEN } from "../constants";
import { navigate } from "@reach/router";
import { TiArrowBack } from "react-icons/ti";

const ROUTE_QUERY = gql`
  query RouteQuery($id: ID!) {
    route(id: $id) {
      title
      attempts
      points
      id
      climbedBy {
        firstName
        lastName
      }
    }
  }
`;

const UPDATE_ATTEMPT_MUTATION = gql`
  mutation UpdateAttempt($id: ID!, $attempts: Int!) {
    updateRouteAttempts(id: $id, attempts: $attempts) {
      id
      title
      attempts
      points
    }
  }
`;

const Route = props => {
  const auth = localStorage.getItem(AUTH_TOKEN);

  return (
    <Container>
      {auth ? (
        <Card>
          <Query
            query={ROUTE_QUERY}
            variables={{ id: props.location.state.id }}
          >
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;
              return (
                <InnerCardWrapper>
                  <Back onClick={() => window.history.back()}>
                    <TiArrowBack size="50px" />
                  </Back>
                  <H2>{data.route.title}</H2>
                  <H3>POINTS: {data.route.points}</H3>
                  <QRCode value={data.route.id} />
                  <AttemptsContainer className="attempts-container">
                    <h3>ATTEMPTS:</h3>
                    <CounterContainer>
                      {data.route.attempts > 0 ? (
                        <Mutation
                          mutation={UPDATE_ATTEMPT_MUTATION}
                          variables={{
                            id: data.route.id,
                            attempts: data.route.attempts - 1
                          }}
                        >
                          {mutation => (
                            <IoIosRemoveCircleOutline
                              onClick={mutation}
                              size="65px"
                            />
                          )}
                        </Mutation>
                      ) : (
                        <IoIosRemoveCircleOutline size="65px" />
                      )}
                      <Attempts>{data.route.attempts}</Attempts>
                      <Mutation
                        mutation={UPDATE_ATTEMPT_MUTATION}
                        variables={{
                          id: data.route.id,
                          attempts: data.route.attempts + 1
                        }}
                      >
                        {mutation => (
                          <IoIosAddCircleOutline
                            onClick={mutation}
                            size="65px"
                          />
                        )}
                      </Mutation>
                    </CounterContainer>
                  </AttemptsContainer>
                  <Signatures>
                    <H3>SIGNATURES: </H3>
                    {!data.route.signatures ? (
                      <CheckMarksContainer>
                        <IoMdRadioButtonOff size={"50px"} />
                        <IoMdRadioButtonOff size={"50px"} />
                      </CheckMarksContainer>
                    ) : null}
                    {data.route.signatures &&
                    data.route.signatures.length === 1 ? (
                      <CheckMarksContainer>
                        <IoMdCheckmarkCircle size={"50px"} />
                        <IoMdRadioButtonOff size={"50px"} />
                      </CheckMarksContainer>
                    ) : null}
                    {data.route.signatures &&
                    data.route.signatures.length === 1 ? (
                      <CheckMarksContainer>
                        <IoMdCheckmarkCircle size={"50px"} />
                        <IoMdCheckmarkCircle size={"50px"} />
                      </CheckMarksContainer>
                    ) : null}
                  </Signatures>
                  <ButtonContainer>
                    <Button title="SUBMIT" />
                  </ButtonContainer>
                </InnerCardWrapper>
              );
            }}
          </Query>
        </Card>
      ) : (
        <Button click={() => navigate("/login")} title="LOGIN" />
      )}
    </Container>
  );
};

export default Route;

const Container = styled.div`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const Card = styled.div`
  width: 85%;
  height: 85%;
  background: #dfe2e8;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  justify-content: space-between;
  padding: 10px;
`;

const AttemptsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  width: 80%;
`;

const CounterContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 50px;
`;

const InnerCardWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 50px;
`;

const Attempts = styled.p`
  font-size: 45px;
  font-weight: 500;
`;

const Signatures = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const CheckMarksContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
`;

const ButtonContainer = styled.div`
  width: 75%;
`;

const Back = styled.div`
  position: fixed;
  top: 100px;
  left: 35px;
`;

const H3 = styled.h3`
  padding: 0;
  height: 20px;
  margin: 0;
`;

const H2 = styled.h2`
  padding: 0;
  height: 25px;
`;
