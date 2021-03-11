const express = require('express');
const axios = require('axios');
const router = express.Router();

const { users }= require('./users_data.js');
// using an array of users is better than having objects inside objects becoz them we will have to add an extra key
// for users....dict will look like {userid:{userdata},userid2:{user2data}}

router.get('/',(req,res) => {
    const userList =[];
    Object.keys(users).forEach(id =>{
        userList.push({id:id, avatarUrl:users[id].avatarUrl}); //.user.avatar_url
    })
    res.send(userList);

});

router.post('/', (req, res) => {
    const githubId = req.body.github_id;
    const linkedinId = req.body.linkedin_id;
    const codechefId = req.body.codechef_id;
    const hackerrankId = req.body.hackerrank_id;
    const twitterId = req.body.twitter_id;
    const mediumId = req.body.medium_id;
    let id;
    let avatarUrl;
    let name;
    let company;
    let blog;
    let location;
    let email;
    let bio;
    let htmlUrl;
    let description;
    let updatedAt;
    let repos = {};
    const reposList = [];
    const promiseUser = axios(`https://api.github.com/users/${githubId}`);
    const promiseRepos = axios(`https://api.github.com/users/${githubId}/repos`);
    Promise.all([promiseUser, promiseRepos])
        .then((responses) => {
            // console.log(responses[0]);
    
                // for user propertiesss
                id = responses[0].data.login;
                avatarUrl = responses[0].data.avatar_url;
                name = responses[0].data.name;
                company = responses[0].data.company;
                blog = responses[0].data.blog;
                location = responses[0].data.location;
                email = responses[0].data.email;
                bio = responses[0].data.bio;
            
            // for repos 
            for (let i = 0; i < responses[1].data.length; i++) {
                name = responses[1].data[i].name;
                htmlUrl = responses[1].data[i].html_url;
                description = responses[1].data[i].description;
                updatedAt = responses[1].data[i].updated_at;
                repos = {
                    name,
                    html_url: htmlUrl,
                    description,
                    updated_at: updatedAt,
                };
                reposList.push(repos);
            }
            //adding it all to users
        
            users[id]={id,avatarUrl,name,company,blog,location,email,bio,githubId,linkedinId,codechefId,hackerrankId,twitterId,mediumId,reposList};
            

            
            //response
            res.statusMessage = 'User Created';
            res.status(201).send({
                id,
            });


        })//promise end
        .catch(() => {
            res.status(404).send({
                error: 'GitHub username is invalid',
            });
        });

});//post ending

router.get('/:id',(req,res) => {
    if(users[req.params.id])
    {
        res.statusMessage = 'Valid User';
        res.status(200).send(users[req.params.id]);
    }
    else 
    {
        res.status(404).send({
            error: 'User does not exist',
        });
    }

});


router.delete('/:id',(req,res) => {

    delete users[req.params.id];
    res.statusMessage = 'Deleted';
    res.status(204).send();

});

module.exports = router;