import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";
import { useEffect, useReducer } from "react";

const initialState = {
  meals: [],
  isLoading: false,
  error: undefined,
};

const reducerFn = (prevState, action) => {
  if (action.type === "DONE") {
    return { meals: action.data, isLoading: false };
  }
  if (action.type === "ERROR") {
    return { ...prevState, isLoading: false, error: action.error };
  }
  return initialState;
};

const AvailableMeals = () => {
  const [state, dispatch] = useReducer(reducerFn, {
    meals: [],
    isLoading: true,
    error: undefined,
  });

  const fetchMeals = async () => {
    try {
      const response = await fetch(
        "https://react-meals-c1f47-default-rtdb.firebaseio.com/meals.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const responseData = await response.json();

      const loadedMeals = [];

      for (let key in responseData) {
        loadedMeals.push({
          id: key,
          ...responseData[key],
        });
      }
      dispatch({
        type: "DONE",
        data: loadedMeals,
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        error: error.message,
      });
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  if (state.isLoading) {
    return (
      <section>
        <div className={classes.spinner}></div>
      </section>
    );
  }

  if (state.error) {
    return (
      <section className={classes.errorMsg}>
        <p>{state.error}</p>
      </section>
    );
  }

  const mealsList = state.meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
