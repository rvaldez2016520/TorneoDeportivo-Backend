'use strict'

var Team = require('../models/team.model');
var Torneo = require('../models/Tournament.model');
var fs = require('fs');
var path = require('path');

function uploadImageTeam(req, res){
    let teamId = req.params.idt;
    var update = req.body;
    var fileName;

   
        if(req.files){

            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];

            var extension = fileName.split('\.');
            var fileExt = extension[1];
            if( fileExt == 'png' ||
                fileExt == 'jpg' ||
                fileExt == 'jpeg' ||
                fileExt == 'gif'){

                            Team.findByIdAndUpdate(teamId, {image:fileName},{new:true}, (err, teamUpdate) => {
                                if(err){
                                    return res.status(500).send({message: 'Error general en la actualización'});
                                }else if(teamUpdate){
                                    return res.send({message: 'Grupo actualizado', teamUpdate});
                                }else{
                                    return res.status(404).send({message: 'Contacto no actualizado'});
                                }
                            }) 
                }else{
                    fs.unlink(filePath, (err)=>{
                        if(err){
                            res.status(500).send({message: 'Extensión no válida y error al eliminar archivo'});
                        }else{
                            res.send({message: 'Extensión no válida'})
                        }
                    })
                }
        }else{
            res.status(400).send({message: 'No has enviado imagen a subir'})
        }
}


function getImageTeam(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/equipos/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

function setTeam(req, res) {
    var torneoId = req.params.id;
    var team = new Team();
    var params = req.body;

    if(params.name){
        Team.findOne({name: params.name},(err, name) => {
            if(err){
                return res.status(500).send({message: 'Error general en el servidor'});
                }else if(name){
                    return res.status(500).send({message: 'Nombre ya en uso!'});
            }else{
                Torneo.findById(torneoId, (err, find) => {
                    if(err){
                        return res.status(500).send({message: 'Error general'})
                    }else if(find){
                        team.name = params.name;
                        team.save((err, teamSaved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al guardar'})
                            }else if(teamSaved){
                                Torneo.findByIdAndUpdate(torneoId, {$push:{team: teamSaved._id}}, {new: true}, (err, teamPush)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general'})
                                    }else if(teamPush){
                                        return res.send({message: 'Creada Exitosamente', teamPush});
                                    }else{
                                        return res.status(500).send({message: 'Error al crear el grupo'});
                                    }
                                }).populate('team');
                            }else{
                                return res.status(404).send({message: 'No se creo el grupo'})
                            }
                        })
                    }else{
                        return res.status(404).send({message: 'la liga al que deseas agregar el grupo no existe.'})
                     }
                 })   
            }
        })
    }else{
        return res.send({message: 'Por favor ingresa los datos obligatorios'});
    }

}

function updateTeam(req, res) {
    let torneoId = req.params.idG;
    let teamId = req.params.idt;
    let update = req.body;

    if(update.name){
        Team.findById(teamId,(err, teamFind) => {
            if(err){
                return res.status(500).send({message: 'Error general al buscar'});
            }else if(teamFind){
                Torneo.findOne({_id: torneoId, team: teamId}, (err, grupoFind) => {
                    if(err){
                        return res.status(500).send({message: 'Error general en la actualización'});
                    }else if(grupoFind){
                        Team.findByIdAndUpdate(teamId, update,{new:true}, (err, teamUpdate) => {
                            if(err){
                                return res.status(500).send({message: 'Error general en la actualización'});
                            }else if(teamUpdate){
                                return res.send({message: 'Grupo actualizado', teamUpdate});
                            }else{
                                return res.status(404).send({message: 'Contacto no actualizado'});
                            }
                        }).populate('team')
                    }else{
                        return res.status(404).send({message: 'Liga no Existente'})
                    }
                })
            }else{
                return res.status(404).send({message: 'Grupo a actualizar inexistente'});
            }
        })

    }else{
        return res.status(404).send({message: 'Por favor ingresa los datos mínimos para actualizar'});
    }

}

function removeTeam(req, res) {
    let torneoId = req.params.idG;
    let teamId = req.params.idt;
 
 
        Torneo.findOneAndUpdate({_id: torneoId, team: teamId},{$pull:{team: teamId}}, {new:true}, (err, groupPull)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(groupPull){
                Team.findByIdAndRemove(teamId, (err, Removed)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al eliminar contacto'});
                    }else if(Removed){
                        return res.send({message: 'Equipo eliminado',Removed});
                    }else{
                        return res.status(500).send({message: 'Liga no encontrado, o ya eliminado'});
                    }
                })
            }else{
                return res.status(500).send({message: 'No se pudo eliminarla equipo del grupo'});
      }
})

}

function getTeams(req, res) {
    Team.find({}).populate('team').exec((err, teams) => {
        if(err){
                return res.status(500).send({message: 'Error general en el servidor'})
        }else if(teams){
                return res.send({message: 'Equipos: ', teams})
        }else{
                return res.status(404).send({message: 'No hay registros'})
        }
    })
}

var Partido = require('../models/partidos.model');

//Funciones de partidos 

function createPartido(req, res) {
    var torneoId = req.params.id;
    var partido = new Partido();
    var params = req.body;

    if( params.name && params.teamOne && params.teamTwo){
        Partido.findOne({name: params.name},(err,partidosFind) => {
            if(err){
                return res.status(500).send({message: 'Error general en el servidor'});
            }else if(partidosFind){
                    return res.status(500).send({message:'Estos equipos ya estan dentro de un partido '});
                }else{
                Torneo.findById(torneoId, (err, ligaFind) => {
                    if(err){
                        return res.status(500).send({message: 'Error general'})
                    }else if(ligaFind){
                        partido.name = params.name;
                        partido.teamOne = params.teamOne;
                        partido.teamTwo = params.teamTwo;
                        partido.goalsTeamOne = 0
                        partido.goalsTeamTwo = 0
                        partido.save((err, partidosSaved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al guardar'})
                            }else if(partidosSaved){
                                Torneo.findByIdAndUpdate(torneoId , {$push:{partido: partidosSaved._id}}, {new: true}, (err, Push)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general'})
                                    }else if(Push){
                                        return res.send({message: 'Creado Exitosamente', Push});
                                    }else{
                                        return res.status(500).send({message: 'Error al crear el partido'});
                                    }
                                }).populate('partido');
                            }else{
                                return res.status(404).send({message: 'No se creo el partido'})
                            }
                        })
                    }else{
                        return res.status(404).send({message: 'El grupo al que desea agregar el partido ya no existe'})
                     }
                 })   
            }
        })
    }else{
        return res.send({message: 'Por favor ingresa los datos obligatorios'});
    }



}


function SetGoals(req, res) {
    let torneoId = req.params.idT;
    let partidoId = req.params.idP;
    let update = req.body;

    if(update.goalsTeamOne && update.goalsTeamTwo){
        Partido.findById(partidoId,(err, teamFind) => {
            if(err){
                return res.status(500).send({message: 'Error general al buscar'});
            }else if(teamFind){
                Torneo.findOne({_id: torneoId, partido: partidoId}, (err, grupoFind) => {
                    if(err){
                        return res.status(500).send({message: 'Error general en la actualización'});
                    }else if(grupoFind){
                        Partido.findByIdAndUpdate(partidoId, update,{new:true}, (err, matchUpdate) => {
                            if(err){
                                return res.status(500).send({message: 'Error general en la actualización'});
                            }else if(matchUpdate){
                                return res.send({message: 'Actualizado ', matchUpdate});
                            }else{
                                return res.status(404).send({message: 'Contacto no actualizado'});
                            }
                        }) .populate('partido')
                    }else{
                        return res.status(404).send({message: 'torneo no Existente'})
                    }
                })
            }else{
                return res.status(404).send({message: 'torneo a actualizar inexistente'});
            }
        })

    }else{
        return res.status(404).send({message: 'Por favor ingresa los datos mínimos para actualizar'});
    }
}


function finalizacionPartido(req, res) {
    
    var torneoId = req.params.idT;
    var partidoId = req.params.idP;

            Torneo.findOneAndUpdate({_id:torneoId, partido: partidoId} , {$pull:{partido: partidoId}}, {new:true}, (err, groupPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(groupPull){
                    Partido.findByIdAndRemove(partidoId, (err, Removed)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al eliminar contacto'});
                        }else if(Removed){
                            return res.send({message: 'Grupo eliminado',Removed});
                        }else{
                            return res.status(500).send({message: 'Liga no encontrado, o ya eliminado'});
                        }
                    })
                }else{
                    return res.status(500).send({message: 'No se pudo eliminarla equipo del grupo'});
          }
    })
    
}

function getPartidos(req, res){
    Partido.find({}).populate('partido').exec((err, match) => {
            if(err){
                    return res.status(500).send({message: 'Error general en el servidor'})
            }else if(match){
                    return res.send({message: 'Usuarios: ', match})
            }else{
                    return res.status(404).send({message: 'No hay registros'})
            }
        })    

}



module.exports = {

    uploadImageTeam,
    getImageTeam,
    setTeam,
    updateTeam,
    removeTeam,
    getTeams,
    //partidos
    createPartido,
    finalizacionPartido ,
    getPartidos ,
    SetGoals
}