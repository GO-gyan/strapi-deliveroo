import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { gql, useQuery, useApolloClient } from "@apollo/client";

import {
  Button,
  Card,
  CardBody,
  CardColumns,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";

import Cart from "../components/cart/";
import AppContext from "../context/AppContext";

const GET_RESTAURANT_DISHES = gql`
  query GetDishList($id: ID!) {
    restaurant(id: $id) {
      _id
      name
      dishes {
        _id
        name
        descriptions
        price
        image {
          url
        }
      }
    }
  }
`;
const Restaurants = () => {
  const routes = useRouter();
  const { id } = routes.query;
  const appContext = useContext(AppContext);
  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (data) {
    return (
      <>
        <h1>{data.restaurant.name}</h1>
        <Row>
          <Col xs="9" style={{ padding: 0 }}>
            <div style={{ display: "inline-block" }} className="h-100">
              {data.restaurant.dishes.map((res) => (
                <Card style={{ width: "30%", margin: "0 10px" }} key={res._id}>
                  <CardImg
                    top={true}
                    style={{ height: 250 }}
                    src={`http://localhost:1337${res.image[0].url}`}
                  />
                  <CardBody>
                    <CardTitle>{res.name}</CardTitle>
                    <CardText>{res.descriptions}</CardText>
                  </CardBody>
                  <div className="card-footer">
                    <Button
                      onClick={() => appContext.addItem(res)}
                      outline
                      color="primary"
                    >
                      + Add To Cart
                    </Button>

                    <style jsx>
                      {`
                        a {
                          color: white;
                        }
                        a:link {
                          text-decoration: none;
                          color: white;
                        }
                        .container-fluid {
                          margin-bottom: 30px;
                        }
                        .btn-outline-primary {
                          color: #007bff !important;
                        }
                        a:hover {
                          color: white !important;
                        }
                      `}
                    </style>
                  </div>
                </Card>
              ))}
            </div>
          </Col>
          <Col xs="3" style={{ padding: 0 }}>
            <div>
              <Cart />
            </div>
          </Col>
        </Row>
      </>
    );
  } else {
    return <p>No dishes found!!</p>;
  }
};

export default Restaurants;
