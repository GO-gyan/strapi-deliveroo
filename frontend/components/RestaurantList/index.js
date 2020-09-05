import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardColumns,
  CardImg,
  CardSubtitle,
} from "reactstrap";
import { CardText, CardTitle, Col, Row } from "reactstrap";

const GET_RESTAURANT_LIST = gql`
  query GetRestaurantList {
    restaurants {
      _id
      name
      descriptions
      image {
        url
      }
    }
  }
`;

const RestaurantList = ({ search }) => {
  const { loading, error, data } = useQuery(GET_RESTAURANT_LIST, {
    notifyOnNetworkStatusChange: true,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (data && data.restaurants && data.restaurants.length > 0) {
    return (
      <>
        <div>
          {data.restaurants.map((res) => (
            <Card
              style={{ width: "30%", margin: "0 10px" }}
              className="h-100"
              key={res._id}
            >
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
                <Link
                  as={`/restaurants/${res._id}`}
                  href={`/restaurants?id=${res._id}`}
                >
                  <a className="btn btn-primary">View</a>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        <style jsx global>
          {`
            a {
              color: white;
            }
            a:link {
              text-decoration: none;
              color: white;
            }
            a:hover {
              color: white;
            }
            .card-columns {
              column-count: 3;
            }
          `}
        </style>
      </>
    );
  } else {
    return <p>No restaurant found</p>;
  }
};

export default RestaurantList;
