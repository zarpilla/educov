import Vue from 'vue';
import { levels } from "../services/level.service";
import { scopes } from "../services/scope.service";
import { states } from "../services/state.service";
import { competences } from "../services/competence.service";

Vue.filter('levelDescription', function (value) {
    let level = levels.find(lev => lev.id == value)
    let ret = level ? level.description : '-'
    return ret;
});

Vue.filter('scopeDescription', function (value) {
    let scope = scopes.find(s => s.id == value)
    let ret = scope != null ? scope.description : '-'
    return ret;
});

Vue.filter('scopeAlias', function (value) {
    let scope = scopes.find(s => s.id == value)
    let ret = scope != null ? ( scope.alias ? scope.alias : scope.description ) : '-'
    return ret;
});

Vue.filter('dimensionDescription', function (value) {
    let found = ''
    scopes.forEach(s => {
        if (s.dimensions) {
            let dim = s.dimensions.find(d => d.id == value)
            if (dim) {
                found = dim.description
            }
        }
        
    })
    return found;
});

Vue.filter('contentsDescription', function (value) {
    let found = ''
    scopes.forEach(s => {
        if (s.contents) {
            let contents = s.contents.find(d => d.id == value)
            if (contents) {
                found = contents.description
            }
        }
        
    })
    return found;
});

Vue.filter('competenceDescription', function (value) {
    let competence = competences.find(s => s.id == value)
    let ret = competence != null ? competence.description : '-'
    return ret;
});

Vue.filter('stateDescription', function (value) {
    let state = states.find(s => s.id == value)
    let ret = state ? state.description : '-'
    return ret;
});

Vue.filter('ageDescription', function (value) {
    let found = ''
    levels.forEach(i => {
        if (i.ages) {
            let age = i.ages.find(d => d.id == value)
            if (age) {
                found = age.desc
            }
        }
        
    })
    return found
});