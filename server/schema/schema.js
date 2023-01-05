const graphql=require('graphql')
const _=require('lodash')
const {GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
GraphQLID,GraphQLInt,
GraphQLList}=graphql

const Book=require('../models/book')
const Author=require('../models/author')

//dummy data
var books=[
    {name:'aaa',genre:"fantasy",id:"1",authorId:"1"},
    {name:'bbb',genre:"sci fi",id:'2',authorId:"2"},
    {name:'ccc',genre:"fantasy",id:"3",authorId:"1"}
]
var authors=[
    {name:'zzz',id:"1",age:45},
    {name:'yyy',id:'2',age:65},
    {name:'uuu',id:"3",age:75}
]

const BookType=new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id: {type:GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                return _.find(authors,{id:parent.authorId})
            }
        }
    })
})
const AuthorType=new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return _.filter(books,{authorId:parent.id})
            }

        }
    })
})
const RootQuery=new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        book:{
            type: BookType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                //code to get data from db
                
               return Book.findById(id)
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                return Author.findById(args.id)
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return books
            }
        },
            authors:{
                type:new GraphQLList(AuthorType),
                resolve(parent,args){
                    return authors
                }

        }

    }
})

const Mutation= new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{type:GraphQLString},
                age:{type:GraphQLInt}
            },
            resolve(parent,args){
                let author=new Author({
                    name:args.name,
                    age:args.age
                })
                return author.save()
            }
        },
        addBook:{
            type:BookType,
            args:{
                name:{type:GraphQLString},
                genre:{type:GraphQLString},
                authorId:{type:GraphQLID}
            },
            resolve(parent,args){
                const book=new Book({
                    name:args.name,
                    genre:args.genre,
                    authorId:args.authorId
                })
                return book.save()
            }
        },
        updateAuthor:{
            type:AuthorType,
            args:{
                name:{type:GraphQLString},
                age:{type:GraphQLInt},
                id:{type:GraphQLID}
            },
            resolve(parent,args){
                return Author.findByIdAndUpdate(args.id,{name:args.name,age:args.age})
            }
        }
    }
})

module.exports= new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
})