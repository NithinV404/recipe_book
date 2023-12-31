const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.listen(5000, () => console.log('listening at 5000'));
app.use(express.json());

app.post('/search', (req, res) => {
    const mealname = req.body.recipeName;
    try
    {
        let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealname}`;
        fetch(url)
        .then(response=>response.json())
        .then(data=>res.send(data))
    }
    catch(error)    
    {
        console.log(error);
    }
});

app.post('/delete',(req,res)=>{
    const recipeid = req.body.recipeId;
    try
    {
        fs.readFile('./src/recipe/recipes.json', 'utf8', (err, data)=>{
            if(err)
            console.log(err);
            else
            {
                const recipes = JSON.parse(data);
                const index = recipes.findIndex(recipe => recipe.idMeal === recipeid);
                if (index !== -1)
                recipes.splice(index, 1);
                fs.writeFile('./src/recipe/recipes.json', JSON.stringify(recipes), err=>{
                    if(err)
                    console.log(err);
                    else
                    res.send({status: 'ok'});
                })
            }
        })
    }
    catch(err){
        console.log(err);
    }
})

app.post('/add',(req,res)=>{
    const recipeid = req.body.recipeId;
    console.log(recipeid)
    try {
        let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeid}`;
        fetch(url)
        .then(response => response.json())
        .then(newRecipe => {
            console.log(newRecipe)
            fs.readFile('./src/recipe/recipes.json', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    const recipes = JSON.parse(data);
                    recipes.push(newRecipe.meals[0]);
                    fs.writeFile('./src/recipe/recipes.json', JSON.stringify(recipes, null, 2), err => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send({status: 'ok'});
                        }
                    });
                }
            });
        });
    } catch (err) {
        console.log(err);
    }
});
